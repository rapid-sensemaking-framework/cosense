import {
  EVENTS
} from './ts-built/constants'
import { getElectron } from './electron-require'
const ipc = getElectron().ipcRenderer
const { IPC } = EVENTS

// TODO: DRY up

const getTemplates = async () => {
  ipc.send(IPC.GET_TEMPLATES)
  return await new Promise((resolve) => {
    ipc.once(IPC.RETURN_TEMPLATES, (event, templates) => resolve(templates))
  })
}

const getTemplate = async (templateId) => {
  ipc.send(IPC.GET_TEMPLATE, templateId)
  return await new Promise((resolve) => {
    ipc.once(IPC.RETURN_TEMPLATE, (event, template) => resolve(template))
  })
}

const updateTemplate = async (data) => {
  ipc.send(IPC.UPDATE_TEMPLATE, data)
  await new Promise((resolve) => {
    ipc.once(IPC.TEMPLATE_UPDATED, () => resolve())
  })
}

const cloneTemplate = async (templateId) => {
  ipc.send(IPC.CLONE_TEMPLATE, templateId)
  return await new Promise((resolve) => {
    ipc.once(IPC.TEMPLATE_CLONED, (event, newTemplateId) => resolve(newTemplateId))
  })
}

const getProcesses = async () => {
  ipc.send(IPC.GET_PROCESSES)
  return await new Promise((resolve) => {
    ipc.once(IPC.RETURN_PROCESSES, (event, processes) => resolve(processes))
  })
}

const getProcess = async (processId) => {
  ipc.send(IPC.GET_PROCESS, processId)
  return await new Promise((resolve) => {
    ipc.once(IPC.RETURN_PROCESS, (event, process) => resolve(process))
  })
}

const createProcess = async (inputs, templateId, template) => {
  ipc.send(IPC.CREATE_AND_RUN_PROCESS, { inputs, templateId, template })
  return await new Promise((resolve) => {
    ipc.once(IPC.PROCESS_CREATED_AND_RUN, (event, processId) => resolve(processId))
  })
}

const cloneProcess = async (processId) => {
  ipc.send(IPC.CLONE_PROCESS, processId)
  return await new Promise((resolve) => {
    ipc.once(IPC.PROCESS_CLONED, (event, newProcessId) => resolve(newProcessId))
  })
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

export {
  getTemplates,
  getTemplate,
  cloneTemplate,
  updateTemplate,
  createProcess,
  getProcesses,
  getProcess,
  cloneProcess,
  onProcessUpdate,
  sendContactableConfigs
}