import { EVENTS } from './ts-built/constants'
import { getElectron } from './electron-require'
const ipc = getElectron().ipcRenderer
const { IPC } = EVENTS

const promisifyEvents = (sendEvent, sendInputs, receiveEvent) => {
  ipc.send(sendEvent, sendInputs)
  return new Promise(resolve => {
    ipc.once(receiveEvent, (event, result) => resolve(result))
  })
}

/*
  TEMPLATES
*/

const getSystemTemplates = () => {
  return promisifyEvents(
    IPC.GET_SYSTEM_TEMPLATES,
    null,
    IPC.RETURN_SYSTEM_TEMPLATES
  )
}

const getUserTemplates = () => {
  return promisifyEvents(
    IPC.GET_USER_TEMPLATES,
    null,
    IPC.RETURN_USER_TEMPLATES
  )
}

const getTemplate = (templateId, userDefined) => {
  return promisifyEvents(
    IPC.GET_TEMPLATE,
    {
      templateId,
      userDefined
    },
    IPC.RETURN_TEMPLATE
  )
}

const updateTemplate = updatedTemplate => {
  return promisifyEvents(
    IPC.UPDATE_TEMPLATE,
    updatedTemplate,
    IPC.TEMPLATE_UPDATED
  )
}

const cloneTemplate = templateId => {
  return promisifyEvents(IPC.CLONE_TEMPLATE, templateId, IPC.TEMPLATE_CLONED)
}

/* 
  PROCESSES
*/

const getProcesses = () => {
  return promisifyEvents(IPC.GET_PROCESSES, null, IPC.RETURN_PROCESSES)
}

const getProcess = processId => {
  return promisifyEvents(IPC.GET_PROCESS, processId, IPC.RETURN_PROCESS)
}

const createProcess = (processConfig, templateId, template) => {
  return promisifyEvents(
    IPC.CREATE_PROCESS,
    { processConfig, templateId, template },
    IPC.PROCESS_CREATED
  )
}

const runProcess = processId => {
  return promisifyEvents(IPC.RUN_PROCESS, processId, IPC.PROCESS_RUNNING)
}

const cloneProcess = processId => {
  return promisifyEvents(IPC.CLONE_PROCESS, processId, IPC.PROCESS_CLONED)
}

const onProcessUpdate = (processId, cb) => {
  const channelId = IPC.PROCESS_UPDATE(processId)
  ipc.on(channelId, (event, updatedProcess) => {
    cb(updatedProcess)
  })
  // cleanup
  return () => {
    ipc.removeAllListeners(channelId)
  }
}

const sendContactableConfigs = (id, contactableConfigs) => {
  return ipc.send(IPC.HANDLE_FACIL_CONTACTABLES_SUBMIT(id), contactableConfigs)
}

/*
  PARTICIPANT LISTS
*/

const getParticipantLists = () => {
  return promisifyEvents(
    IPC.GET_PARTICIPANT_LISTS,
    null,
    IPC.RETURN_PARTICIPANT_LISTS
  )
}

const getParticipantList = slug => {
  return promisifyEvents(
    IPC.GET_PARTICIPANT_LIST,
    slug,
    IPC.RETURN_PARTICIPANT_LIST
  )
}

const createParticipantList = participantList => {
  return promisifyEvents(
    IPC.CREATE_PARTICIPANT_LIST,
    participantList,
    IPC.PARTICIPANT_LIST_CREATED
  )
}

const updateParticipantList = participantList => {
  return promisifyEvents(
    IPC.UPDATE_PARTICIPANT_LIST,
    participantList,
    IPC.PARTICIPANT_LIST_UPDATED
  )
}

export {
  // participant lists
  createParticipantList,
  updateParticipantList,
  getParticipantList,
  getParticipantLists,
  // templates
  getSystemTemplates,
  getUserTemplates,
  getTemplate,
  cloneTemplate,
  updateTemplate,
  // processes
  createProcess,
  runProcess,
  getProcesses,
  getProcess,
  cloneProcess,
  onProcessUpdate,
  sendContactableConfigs
}
