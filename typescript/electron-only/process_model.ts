import {
  CONTACTABLE_CONFIG_PORT_NAME
} from '../constants'
import {
  guidGenerator
} from '../utils'
import {
  ContactableConfig,
  RegisterConfig,
  RegisterConfigSet,
  FormInputs,
  Process,
  Template,
  ExpectedInput,
  Stage,
  Option,
  GraphConnection,
  Statement,
  Graph
} from '../types'

import {
  getContactablesFromFacilitator,
  getContactablesFromRegistration,
} from './participant_register'
import {
  overrideJsonGraph,
  start
} from './run_graph'

const processes = {}

const getProcesses = async (): Promise<Process[]> => {
  return Object.values(processes)
}

const getProcess = async (id: string): Promise<Process> => {
  return processes[id]
}

const setProcessProp = async (id: string, key: string, value: any): Promise<boolean> => {
  console.log(`updating process ${id} value ${key}: ${JSON.stringify(value)}`)
  processes[id][key] = value
  return true
}

const newProcess = async (
  formInputs: FormInputs,
  templateId: string,
  template: Template,
  graph: Graph,
  registerWsUrl: string
): Promise<string> => {
  const id = guidGenerator()
  const registerConfigs = {}
  const participants = {}
  template.stages.forEach((stage: Stage) => {
    stage.expectedInputs.forEach((expectedInput: ExpectedInput) => {
      const { process, port } = expectedInput
      if (port === CONTACTABLE_CONFIG_PORT_NAME) {
        const id = guidGenerator()
        const registerConfig = getRegisterConfig(formInputs, process, id, registerWsUrl)
        registerConfigs[process] = registerConfig
        participants[process] = [] // empty for now
      }
    })
  })

  const newProcess: Process = {
    id,
    templateId,
    template,
    graph,
    configuring: true,
    running: false,
    complete: false,
    results: null,
    error: null,
    startTime: Date.now(),
    formInputs,
    registerConfigs,
    participants
  }
  processes[id] = newProcess
  console.log('created a new process configuration', newProcess)
  return id
}

interface HandlerInput {
  input?: string
  registerConfig?: RegisterConfig
  callback?: (c: ContactableConfig) => void
}
type Handler = (handlerInput: HandlerInput) => Promise<any>

const handleText: Handler = async ({ input }): Promise<string> => {
  return input
}
const handleInt: Handler = async ({ input }): Promise<number> => {
  return parseInt(input)
}
const handleArray: Handler = async ({ input }): Promise<Array<any>> => {
  return JSON.parse(input)
}
const handleObject: Handler = async ({ input }): Promise<object> => {
  return JSON.parse(input)
}
const handleMaxTime: Handler = async ({ input }): Promise<number> => {
  return parseFloat(input) * 60 // minutes, converted to seconds
}
const handleOptionsData: Handler = async ({ input }): Promise<Option[]> => {
  // e.g. a+A=Agree, b+B=Block
  return input
    .split(',')
    .map((s: string) => {
      // trim cleans white space
      const [triggersString, text] = s.trim().split('=')
      return {
        triggers: triggersString.split('+'),
        text
      }
    })
}
const handleStatementsData: Handler = async ({ input }): Promise<Array<Statement>> => {
  return input.split('\n').map(s => ({ text: s }))
}
const handleRegisterConfig: Handler = ({ registerConfig, callback }): Promise<ContactableConfig[]> => {
  const { isFacilitator, maxTime, maxParticipants, processContext, id, wsUrl } = registerConfig
  return isFacilitator ? getContactablesFromFacilitator(id) : getContactablesFromRegistration(
    wsUrl,
    id,
    maxTime,
    maxParticipants,
    processContext,
    callback
  )
}

// noflo input types
// all, string, number, int, object, array, boolean, color, date, bang, function, buffer, stream
// map these to form inputs
// allow for overrides
const nofloTypeMap = {
  string: handleText,
  number: handleText,
  int: handleInt,
  boolean: () => { }, // TODO
  array: handleArray,
  object: handleObject,
  all: handleText
  // TODO: the rest
}
const specialPorts = {
  contactable_configs: handleRegisterConfig,
  statements: handleStatementsData,
  options: handleOptionsData,
  max_time: handleMaxTime
}

// TODO: create a default?
const mapInputToHandler = (expectedInput: ExpectedInput): Handler => {
  const { type, port } = expectedInput
  // specialPorts > basic type
  return specialPorts[port] || nofloTypeMap[type]
}

const convertToGraphConnection = (process: string, port: string, data: any): GraphConnection => {
  return {
    tgt: {
      process,
      port
    },
    data
  }
}

const updateParticipants = async (processId: string, name: string, newParticipants: ContactableConfig[], overwrite: boolean) => {
  const p = await getProcess(processId)
  const participants = {
    ...p.participants,
    [name]: overwrite ? newParticipants : p.participants[name].concat(newParticipants)
  }
  setProcessProp(processId, 'participants', participants)
}

const getHandlerInput = (processId: string, expectedInput: ExpectedInput, formInputs: FormInputs, registerConfigs: RegisterConfigSet): HandlerInput => {
  const { process, port } = expectedInput

  if (port === CONTACTABLE_CONFIG_PORT_NAME) {
    return {
      registerConfig: registerConfigs[process],
      callback: (contactableConfig: ContactableConfig) => {
        updateParticipants(processId, process, [contactableConfig], false)
      }
    }
  }

  return {
    input: formInputs[`${process}--${port}`]
  }
}

const runProcess = async (processId: string, runtimeAddress: string , runtimeSecret: string) => {
  const {
    registerConfigs,
    formInputs,
    graph,
    template
  } = await getProcess(processId)

  const promises = []
  template.stages.forEach((stage: Stage) => {
    stage.expectedInputs.forEach((expectedInput: ExpectedInput) => {
      promises.push((async () => {
        const handler: Handler = mapInputToHandler(expectedInput)
        const handlerInput: HandlerInput = getHandlerInput(processId, expectedInput, formInputs, registerConfigs)
        const finalInput = await handler(handlerInput)
        const { process, port } = expectedInput
        if (port === CONTACTABLE_CONFIG_PORT_NAME) {
          updateParticipants(processId, process, finalInput, true)
        }
        return convertToGraphConnection(process, port, finalInput)
      })())
    })
  })
  const GraphConnections = await Promise.all(promises)

  // once they're all ready, now commence the process
  // mark as running now
  setProcessProp(processId, 'configuring', false)
  setProcessProp(processId, 'running', true)
  const jsonGraph = overrideJsonGraph(GraphConnections, graph)
  const dataWatcher = (signal) => {
    if (signal.id === template.resultConnection) {
      // save the results to the process
      setProcessProp(processId, 'results', signal.data)
    }
  }
  start(jsonGraph, runtimeAddress, runtimeSecret, dataWatcher)
    .then(() => {
      setProcessProp(processId, 'running', false)
      setProcessProp(processId, 'complete', true)
    }) // logs and save to memory
    .catch((e) => {
      setProcessProp(processId, 'running', false)
      setProcessProp(processId, 'error', e)
    }) // logs and save to memory
}

const getRegisterConfig = (formInputs: FormInputs, process: string, id: string, wsUrl: string): RegisterConfig => {
  return {
    stage: process,
    isFacilitator: formInputs[`${process}-check-facil_register`] === 'facil_register',
    processContext: formInputs[`${process}-ParticipantRegister-process_context`] || process,
    maxTime: (parseFloat(formInputs[`${process}-ParticipantRegister-max_time`]) || 5) * 60, // five minute default, converted to seconds
    maxParticipants: formInputs[`${process}-ParticipantRegister-max_participants`] || '*', // unlimited default
    id,
    wsUrl
  }
}

export {
  getProcesses,
  getProcess,
  setProcessProp,
  newProcess,
  runProcess,
  getRegisterConfig,
  handleRegisterConfig,
  convertToGraphConnection,
  handleOptionsData,
  mapInputToHandler
}


/*
  // capture the results for each as they come in
  // do this in a non-blocking way
  const updatePList = async (key: string, newP: ContactableConfig, allP?: ContactableConfig[]) => {
    const old = (await getProcess(processId))[key]
    const updated = allP ? allP : [...old].concat(newP) // clone and add
    setProcessProp(processId, key, updated)
  }
  const ideationP: Promise<ContactableConfig[]> = proceedWithRegisterConfig(app, paths[0], registerConfigs[0], (newP: ContactableConfig) => {
    updatePList('ideationParticipants', newP)
  })
  const reactionP: Promise<ContactableConfig[]> = proceedWithRegisterConfig(app, paths[1], registerConfigs[1], (newP: ContactableConfig) => {
    updatePList('reactionParticipants', newP)
  })
  const summaryP: Promise<ContactableConfig[]> = proceedWithRegisterConfig(app, paths[2], registerConfigs[2], (newP: ContactableConfig) => {
    updatePList('summaryParticipants', newP)
  })
  // capture the sum results for each
  ideationP.then((ideationParticipants: ContactableConfig[]) => {
    updatePList('ideationParticipants', null, ideationParticipants)
  })
  reactionP.then((reactionParticipants: ContactableConfig[]) => {
    updatePList('reactionParticipants', null, reactionParticipants)
  })
  summaryP.then((summaryParticipants: ContactableConfig[]) => {
    updatePList('summaryParticipants', null, summaryParticipants)
  })
*/