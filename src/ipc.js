import {
  EVENTS
} from './ts-built/constants'
import { getElectron } from './electron-require'
const ipc = getElectron().ipcRenderer
const { IPC } = EVENTS

// TODO: DRY up

const getSystemTemplates = async () => {
  ipc.send(IPC.GET_SYSTEM_TEMPLATES)
  return new Promise((resolve) => {
    ipc.once(IPC.RETURN_SYSTEM_TEMPLATES, (event, templates) => resolve(templates))
  })
}

const getUserTemplates = async () => {
  ipc.send(IPC.GET_USER_TEMPLATES)
  return new Promise((resolve) => {
    ipc.once(IPC.RETURN_USER_TEMPLATES, (event, templates) => resolve(templates))
  })
}

const getTemplate = async (templateId, userDefined) => {
  ipc.send(IPC.GET_TEMPLATE, {
    templateId,
    userDefined
  })
  return new Promise((resolve) => {
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
  return new Promise((resolve) => {
    ipc.once(IPC.TEMPLATE_CLONED, (event, newTemplateId) => resolve(newTemplateId))
  })
}

const getProcesses = async () => {
  ipc.send(IPC.GET_PROCESSES)
  return new Promise((resolve) => {
    ipc.once(IPC.RETURN_PROCESSES, (event, processes) => resolve(processes))
  })
}

const getProcess = async (processId) => {
  ipc.send(IPC.GET_PROCESS, processId)
  return new Promise((resolve) => {
    ipc.once(IPC.RETURN_PROCESS, (event, process) => resolve(process))
  })
}

const createProcess = async (inputs, templateId, template) => {
  ipc.send(IPC.CREATE_PROCESS, { inputs, templateId, template })
  return new Promise((resolve) => {
    ipc.once(IPC.PROCESS_CREATED, (event, processId) => resolve(processId))
  })
}

const runProcess = async (processId) => {
  ipc.send(IPC.RUN_PROCESS, processId)
  return new Promise((resolve) => {
    ipc.once(IPC.PROCESS_RUNNING, () => resolve())
  })
}

const cloneProcess = async (processId) => {
  ipc.send(IPC.CLONE_PROCESS, processId)
  return new Promise((resolve) => {
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
  getSystemTemplates,
  getUserTemplates,
  getTemplate,
  cloneTemplate,
  updateTemplate,
  createProcess,
  runProcess,
  getProcesses,
  getProcess,
  cloneProcess,
  onProcessUpdate,
  sendContactableConfigs
}