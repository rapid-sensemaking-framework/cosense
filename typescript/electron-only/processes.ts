import * as electron from 'electron'
import * as fs from 'fs'
import * as socketClient from 'socket.io-client'
import { Statement, Option, ContactableConfig } from 'rsf-types'
import {
  ProcessConfig,
  Process,
  ExpectedInput,
  GraphConnection,
  Handler,
  NofloSignalPayload,
  TemplateSubmitInput
} from '../types'
import { CONTACTABLE_CONFIG_PORT_NAME, EVENTS } from '../constants'
import { guidGenerator } from '../utils'
import { USER_PROCESSES_PATH } from '../folders'

import {
  getContactablesFromRegistration,
  createParticipantRegister
} from './participant-register'
import { overrideJsonGraph, start } from './run-graph'
import { FROM_PUBLIC_LINK } from '../process-config'
import { getGraph } from './templates'

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
  fs.writeFileSync(processPath, JSON.stringify(process, null, 2))
}

const getProcesses = async (): Promise<Process[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(USER_PROCESSES_PATH, (err, files) => {
      if (err) {
        reject(err)
        return
      }
      // filter out .DS_Store and any other weird files
      const templates = files
        .filter(f => f.includes('.json'))
        .map(filename => {
          return getProcessAsObject(filename.replace('.json', ''))
        })
      resolve(templates)
    })
  })
}

const getProcess = async (id: string): Promise<Process> => {
  return getProcessAsObject(id)
}

const setProcessProp = async (
  id: string,
  key: string,
  value: any
): Promise<boolean> => {
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
    createdTime: Date.now(),
    startTime: null,
    endTime: null,
    configuring: true,
    running: false,
    complete: false,
    results: null,
    error: null
  }
}

const updateParticipants = async (
  processId: string,
  newParticipants: ContactableConfig[],
  // if not overwrite, conjoins with existing participants
  overwrite: boolean
) => {
  const p = await getProcess(processId)
  const { processConfig } = p
  const { participantsConfig } = processConfig
  const { participants } = participantsConfig
  const newProcessConfig = {
    ...processConfig,
    participantsConfig: {
      ...participantsConfig,
      participants: overwrite
        ? newParticipants
        : participants.concat(newParticipants)
    }
  }
  await setProcessProp(processId, 'processConfig', newProcessConfig)
}

const createProcess = async ({
  processConfig,
  templateId,
  template
}: TemplateSubmitInput): Promise<string> => {
  // not a bug, templateId is shared with graphId
  const graph = getGraph(template.graphName)

  const { method, publicLink } = processConfig.participantsConfig
  if (method === FROM_PUBLIC_LINK) {
    await createParticipantRegister(publicLink)
  }

  const newProcess: Process = {
    ...newProcessDefaults(),
    name: processConfig.name,
    templateId,
    template,
    graph,
    processConfig
  }
  writeProcess(newProcess.id, newProcess)
  console.log('created a new process configuration', newProcess.id)
  return newProcess.id
}

const cloneProcess = async (processId: string): Promise<string> => {
  const orig = await getProcess(processId)
  const newProcess = {
    ...orig,
    processConfig: {
      ...orig.processConfig,
      participantsConfig: {
        ...orig.processConfig.participantsConfig,
        participants: [],
        publicLink: {
          ...orig.processConfig.participantsConfig.publicLink,
          id: guidGenerator() // create a new id for the public link
        }
      }
    },
    ...newProcessDefaults()
  }
  const { method, publicLink } = newProcess.processConfig.participantsConfig
  if (method === FROM_PUBLIC_LINK) {
    await createParticipantRegister(publicLink)
  }
  writeProcess(newProcess.id, newProcess)
  console.log('created a new process configuration by cloning', newProcess.id)
  return newProcess.id
}

/*
  HANDLERS
*/
const defaultHandler: Handler = async (input: any): Promise<any> => {
  return input
}
const handleText: Handler = async (input: string): Promise<string> => {
  return input
}
const handleInt: Handler = async (input: string): Promise<number> => {
  return parseInt(input)
}
const handleArray: Handler = async (input: string): Promise<Array<any>> => {
  return JSON.parse(input)
}
const handleObject: Handler = async (input: string): Promise<object> => {
  return JSON.parse(input)
}
const handleFloat: Handler = async (input: string): Promise<number> => {
  return parseFloat(input)
}
const handleOptionsData: Handler = async (input: string): Promise<Option[]> => {
  // e.g. a+A=Agree, b+B=Block
  return input.split(',').map((s: string) => {
    // trim cleans white space
    const [triggersString, text] = s.trim().split('=')
    return {
      triggers: triggersString.split('+'),
      text
    }
  })
}
const handleStatementsData: Handler = async (
  input: string
): Promise<Array<Statement>> => {
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
  boolean: () => {}, // TODO
  array: handleArray,
  object: handleObject,
  all: defaultHandler
  // TODO: the rest
}
const specialPorts = {
  contactable_configs: defaultHandler,
  statements: handleStatementsData,
  options: handleOptionsData,
  max_time: handleFloat
}

const mapInputToHandler = (expectedInput: ExpectedInput): Handler => {
  const { type, port } = expectedInput
  // specialPorts > basic type > default
  return specialPorts[port] || nofloTypeMap[type] || defaultHandler
}

const convertToGraphConnection = (
  process: string,
  port: string,
  data: any
): GraphConnection => {
  return {
    tgt: {
      process,
      port
    },
    data
  }
}

const resolveAndConvert = async (
  expectedInput: ExpectedInput,
  processConfig: ProcessConfig
): Promise<GraphConnection> => {
  const { process, port } = expectedInput
  const givenInput = processConfig.templateSpecific[`${process}--${port}`]
  // a handler will perform any conversion of
  // the data that's necessary
  const finalInput = await mapInputToHandler(expectedInput)(givenInput)
  // convert it to a GraphConnection input for noflo
  return convertToGraphConnection(process, port, finalInput)
}

const runProcess = async (
  processId: string,
  runtimeAddress: string,
  runtimeSecret: string
) => {
  const { processConfig, graph, template } = await getProcess(processId)

  const graphConnections = await Promise.all(
    template.expectedInputs
      .filter(e => e.port !== CONTACTABLE_CONFIG_PORT_NAME)
      .map((expectedInput: ExpectedInput) => {
        return resolveAndConvert(expectedInput, processConfig)
      })
  )

  // once they're all ready, now commence the process
  // mark as running now
  await setProcessProp(processId, 'configuring', false)
  await setProcessProp(processId, 'running', true)
  await setProcessProp(processId, 'startTime', Date.now())

  // handle the public link option
  const { method, publicLink } = processConfig.participantsConfig
  let participants: ContactableConfig[] = []
  if (method === FROM_PUBLIC_LINK) {
    participants = await getContactablesFromRegistration(
      publicLink.id,
      (contactableConfig: ContactableConfig) => {
        const overwrite = false
        updateParticipants(processId, [contactableConfig], overwrite)
      }
    )
    const overwrite = true
    await updateParticipants(processId, participants, overwrite)
  } else {
    participants = processConfig.participantsConfig.participants
  }

  // handle the contactable_configs
  // including the special case
  // for sending results to everyone, which
  // we should respect the preference/override in the processConfig
  template.expectedInputs
    .filter(e => e.port === CONTACTABLE_CONFIG_PORT_NAME)
    .forEach((expectedInput: ExpectedInput) => {
      const { process, port } = expectedInput
      // use the same participants for SendMessageToAll
      // unless they shouldn't be sent at all
      const contactable_configs = process.includes('SendMessageToAll')
        ? processConfig.sendToAll
          ? participants
          : []
        : participants
      const graphConnection = convertToGraphConnection(
        process,
        port,
        contactable_configs
      )
      graphConnections.push(graphConnection)
    })

  const jsonGraph = overrideJsonGraph(graphConnections, graph)
  const results: Array<any> = []
  const signalWatcher = async (signal: NofloSignalPayload) => {
    if (signal.tgt.node === 'core/Output') {
      // save the results to the process
      results.push(signal.data)
      await setProcessProp(processId, 'results', results)
    }
  }

  try {
    await start(jsonGraph, runtimeAddress, runtimeSecret, signalWatcher)
  } catch (e) {
    await setProcessProp(processId, 'error', e)
  }
  await setProcessProp(processId, 'running', false)
  await setProcessProp(processId, 'complete', true)
  await setProcessProp(processId, 'endTime', Date.now())
}

export {
  getProcesses,
  getProcess,
  setProcessProp,
  createProcess,
  cloneProcess,
  runProcess,
  convertToGraphConnection,
  handleOptionsData,
  mapInputToHandler
}
