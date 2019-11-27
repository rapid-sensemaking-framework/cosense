import * as electron from 'electron'
import * as fs from 'fs'
import {
  Statement,
  Option,
  ContactableConfig
} from 'rsf-types'
import {
  RegisterConfig,
  FormInputs,
  Process,
  Template,
  ExpectedInput,
  GraphConnection,
  Graph,
  Handler,
  HandlerInput,
  NofloSignalPayload
} from '../types'
import {
  CONTACTABLE_CONFIG_PORT_NAME,
  EVENTS
} from '../constants'
import {
  guidGenerator
} from '../utils'
import {
  USER_PROCESSES_PATH
} from './folders'

import {
  getContactablesFromRegistration,
} from './participant_register'
import {
  overrideJsonGraph,
  start
} from './run_graph'

const { BrowserWindow } = electron

const getProcessPath = (processId: string) => {
  return `${USER_PROCESSES_PATH}/${processId}.json`
}

const getProcessAsObject = (processId: string) => {
  const processPath = getProcessPath(processId)
  const processString = fs.readFileSync(processPath, { encoding: 'utf8' })
  const process: Process = JSON.parse(processString)
  return process
}

const writeProcess = (processId: string, process: Process) => {
  const processPath = getProcessPath(processId)
  fs.writeFileSync(processPath, JSON.stringify(process))
}

const getProcesses = async (): Promise<Process[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(USER_PROCESSES_PATH, (err, files) => {
      if (err) {
        reject(err)
        return
      }
      // filter out .DS_Store and any other weird files
      const templates = files.filter(f => f.includes('.json')).map(filename => {
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

/*

const { maxTime, maxParticipants, processContext, id, wsUrl } = registerConfig
  return getContactablesFromRegistration(
    wsUrl,
    id,
    maxTime,
    maxParticipants,
    processContext,
    callback
  )
  updateParticipants(processId, process, finalInput, true)
*/

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

const updateParticipants = async (processId: string, name: string, newParticipants: ContactableConfig[], overwrite: boolean) => {
  const p = await getProcess(processId)
  const participants = {
    ...p.participants,
    [name]: overwrite ? newParticipants : p.participants[name].concat(newParticipants)
  }
  await setProcessProp(processId, 'participants', participants)
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
  template.expectedInputs
    .filter((expectedInput: ExpectedInput) => expectedInput.port === CONTACTABLE_CONFIG_PORT_NAME)
    .forEach((expectedInput: ExpectedInput) => {
      const { process } = expectedInput
      const id = guidGenerator()
      const registerConfig = getRegisterConfig(formInputs, process, id, registerWsUrl)
      registerConfigs[process] = registerConfig
      participants[process] = [] // empty for now
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

const cloneProcess = async (processId: string): Promise<string> => {
  const orig = await getProcess(processId)
  const newProcess = {
    ...orig,
    ...newProcessDefaults()
  }
  writeProcess(newProcess.id, newProcess)
  console.log('created a new process configuration by cloning', newProcess.id)
  return newProcess.id
}

/*
  HANDLERS
*/
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

const getHandlerInput = (
  expectedInput: ExpectedInput,
  formInputs: FormInputs
): HandlerInput => {
  const { process, port } = expectedInput
  return {
    input: formInputs[`${process}--${port}`]
  }
}

const resolveExpectedInput = async (
  expectedInput: ExpectedInput,
  formInputs: FormInputs
) => {
  const handler: Handler = mapInputToHandler(expectedInput)
  const handlerInput: HandlerInput = getHandlerInput(
    expectedInput,
    formInputs,
  )
  const finalInput = await handler(handlerInput)
  return finalInput
}

const resolveAndConvert = async (expectedInput: ExpectedInput, formInputs: FormInputs): Promise<GraphConnection> => {
  const { process, port } = expectedInput
  const finalInput = await resolveExpectedInput(expectedInput, formInputs)
  return convertToGraphConnection(process, port, finalInput)
}

const runProcess = async (processId: string, runtimeAddress: string, runtimeSecret: string) => {
  const {
    formInputs,
    graph,
    template,
  } = await getProcess(processId)

  const graphConnections = await Promise.all(template.expectedInputs.map((e: ExpectedInput) => {
    return resolveAndConvert(e, formInputs)
  }))

  // once they're all ready, now commence the process
  // mark as running now
  await setProcessProp(processId, 'configuring', false)
  await setProcessProp(processId, 'running', true)
  const jsonGraph = overrideJsonGraph(graphConnections, graph)
  const results: Array<any> = []
  const dataWatcher = async (signal: NofloSignalPayload) => {
    // TODO: use the core/Output signal as
    // an input for 'results'
    // template.resultConnection
    if (signal.tgt.node === 'core/Output') {
      // save the results to the process
      results.push(signal.data)
      await setProcessProp(processId, 'results', results)
    }
  }

  start(jsonGraph, runtimeAddress, runtimeSecret, dataWatcher)
    .then(async () => {
      await setProcessProp(processId, 'running', false)
      await setProcessProp(processId, 'complete', true)
    })
    .catch(async (e) => {
      await setProcessProp(processId, 'running', false)
      await setProcessProp(processId, 'error', e)
    }) // logs and save to memory
}

export {
  getProcesses,
  getProcess,
  setProcessProp,
  newProcess,
  cloneProcess,
  runProcess,
  getRegisterConfig,
  convertToGraphConnection,
  handleOptionsData,
  mapInputToHandler
}