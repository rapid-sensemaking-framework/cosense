import * as electron from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import {
  CONTACTABLE_CONFIG_PORT_NAME,
  EVENTS
} from '../constants'
import {
  guidGenerator
} from '../utils'
import {
  ContactableConfig,
  RegisterConfig,
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

const { BrowserWindow } = electron

const PROCESSES_FOLDER = 'processes'

const getProcessPath = (processId: string) => {
  return path.join(electron.app.getAppPath(), `${PROCESSES_FOLDER}/${processId}.json`)
}

const getProcessAsObject = (processId: string) => {
  const processPath = getProcessPath(processId)
  const processString = fs.readFileSync(processPath, { encoding: 'utf8' })
  const process: Process = JSON.parse(processString)
  return process
}

const writeProcess = (processId, process) => {
  const processPath = getProcessPath(processId)
  fs.writeFileSync(processPath, JSON.stringify(process))
}

const getProcesses = async (): Promise<Process[]> => {
  return new Promise((resolve, reject) => {
    const processesPath = path.join(electron.app.getAppPath(), PROCESSES_FOLDER)
    fs.readdir(processesPath, (err, files) => {
      if (err) {
        reject(err)
        return
      }
      const templates = files.map(filename => {
        return getProcessAsObject(filename.replace('.json', ''))
      })
      resolve(templates)
    })
  })
}

const getProcess = async (id: string): Promise<Process> => {
  return getProcessAsObject(id)
}

const setProcessProp = async (id: string, key: string, value: any): Promise<boolean> => {
  console.log(`updating process ${id} value ${key}: ${JSON.stringify(value)}`)
  const orig = await getProcess(id)
  const newProcess = {
    ...orig,
    [key]: value
  }
  writeProcess(id, newProcess)
  // send this updated value to any BrowserWindow that is listening
  BrowserWindow.getAllWindows().forEach(win => {
    win.webContents.send(EVENTS.IPC.PROCESS_UPDATE(id), newProcess)
  })
  return true
}

const newProcessDefaults = () => {
  return {
    id: guidGenerator(),
    startTime: Date.now(),
    configuring: true,
    running: false,
    complete: false,
    results: null,
    error: null
  }
}

const newProcess = async (
  formInputs: FormInputs,
  templateId: string,
  template: Template,
  graph: Graph,
  registerWsUrl: string
): Promise<string> => {
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
    ...newProcessDefaults(),
    templateId,
    template,
    graph,
    formInputs,
    registerConfigs,
    participants
  }
  writeProcess(newProcess.id, newProcess)
  console.log('created a new process configuration', newProcess.id)
  return newProcess.id
}

const cloneProcess = async (processId): Promise<string> => {
  const orig = await getProcess(processId)
  const newProcess = {
    ...orig,
    ...newProcessDefaults()
  }
  writeProcess(newProcess.id, newProcess)
  console.log('created a new process configuration by cloning', newProcess.id)
  return newProcess.id
}

interface HandlerInput {
  input?: string
  registerConfig?: RegisterConfig
  callback?: (c: ContactableConfig) => void,
  participants?: ContactableConfig[]
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
const handleRegisterConfig: Handler = ({ participants, registerConfig, callback }): Promise<ContactableConfig[]> => {
  if (participants.length > 0) {
    return Promise.resolve(participants)
  }
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
  await setProcessProp(processId, 'participants', participants)
}

const getHandlerInput = (
  processId: string,
  expectedInput: ExpectedInput,
  formInputs: FormInputs,
  registerConfig: RegisterConfig,
  participants: ContactableConfig[]
): HandlerInput => {
  const { process, port } = expectedInput
  if (port === CONTACTABLE_CONFIG_PORT_NAME) {
    return {
      participants,
      registerConfig,
      callback: (contactableConfig: ContactableConfig) => {
        updateParticipants(processId, process, [contactableConfig], false)
      }
    }
  }
  return {
    input: formInputs[`${process}--${port}`]
  }
}

const resolveExpectedInput = async (
  expectedInput: ExpectedInput,
  processId: string,
  formInputs: FormInputs,
  registerConfig: RegisterConfig,
  participants: ContactableConfig[]
) => {
  const { process, port } = expectedInput
  const handler: Handler = mapInputToHandler(expectedInput)
  const handlerInput: HandlerInput = getHandlerInput(
    processId,
    expectedInput,
    formInputs,
    registerConfig,
    participants
  )
  const finalInput = await handler(handlerInput)
  if (port === CONTACTABLE_CONFIG_PORT_NAME) {
    updateParticipants(processId, process, finalInput, true)
  }
  return finalInput
}

const runProcess = async (processId: string, runtimeAddress: string, runtimeSecret: string) => {
  const {
    registerConfigs,
    formInputs,
    graph,
    template,
    participants
  } = await getProcess(processId)

  const promises = []
  template.stages.forEach((stage: Stage) => {
    stage.expectedInputs.forEach((expectedInput: ExpectedInput) => {
      const { process, port } = expectedInput
      promises.push((async () => {
        const finalInput = await resolveExpectedInput(
          expectedInput,
          processId,
          formInputs,
          registerConfigs[process],
          participants[process]
        )
        return convertToGraphConnection(process, port, finalInput)
      })())
    })
  })
  const GraphConnections = await Promise.all(promises)

  // once they're all ready, now commence the process
  // mark as running now
  await setProcessProp(processId, 'configuring', false)
  await setProcessProp(processId, 'running', true)
  const jsonGraph = overrideJsonGraph(GraphConnections, graph)
  const dataWatcher = async (signal) => {
    if (signal.id === template.resultConnection) {
      // save the results to the process
      await setProcessProp(processId, 'results', signal.data)
    }
  }

  start(jsonGraph, runtimeAddress, runtimeSecret, dataWatcher)
    .then(async () => {
      await setProcessProp(processId, 'running', false)
      await setProcessProp(processId, 'complete', true)
    }) // logs and save to memory
    .catch(async (e) => {
      await setProcessProp(processId, 'running', false)
      await setProcessProp(processId, 'error', e)
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
  cloneProcess,
  runProcess,
  getRegisterConfig,
  handleRegisterConfig,
  convertToGraphConnection,
  handleOptionsData,
  mapInputToHandler
}