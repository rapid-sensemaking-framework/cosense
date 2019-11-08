import * as electron from 'electron'
const ipc = electron.ipcMain

import {
  EVENTS
} from '../constants'
import {
  updateTemplate,
  handleTemplateSubmit,
  getTemplate,
  getTemplates,
  cloneTemplate
} from './templates'
import {
  cloneProcess,
  getProcess,
  getProcesses,
  runProcess
} from './processes'
const { IPC } = EVENTS

const attachEventListeners = () => {
  ipc.on(IPC.UPDATE_TEMPLATE, async (event, data) => {
    await updateTemplate(data)
    event.sender.send(IPC.TEMPLATE_UPDATED)
  })

  ipc.on(IPC.CREATE_AND_RUN_PROCESS, async (event, data) => {
    const processId = await handleTemplateSubmit(data)
    event.sender.send(IPC.PROCESS_CREATED_AND_RUN, processId)
  })

  ipc.on(IPC.CLONE_PROCESS, async (event, processId) => {
    const newProcessId = await cloneProcess(processId)
    // kick it off, but don't wait on it, or depend on it for anything
    const runtimeAddress = process.env.RUNTIME_ADDRESS
    const runtimeSecret = process.env.RUNTIME_SECRET
    runProcess(newProcessId, runtimeAddress, runtimeSecret)
    event.sender.send(IPC.PROCESS_CLONED, newProcessId)
  })

  ipc.on(IPC.CLONE_TEMPLATE, async (event, templateId) => {
    const newTemplateId = await cloneTemplate(templateId)
    event.sender.send(IPC.TEMPLATE_CLONED, newTemplateId)
  })

  ipc.on(IPC.GET_PROCESS, async (event, processId) => {
    const process = await getProcess(processId)
    event.sender.send(IPC.RETURN_PROCESS, process)
  })

  ipc.on(IPC.GET_PROCESSES, async (event) => {
    const processes = await getProcesses()
    event.sender.send(IPC.RETURN_PROCESSES, processes)
  })

  ipc.on(IPC.GET_TEMPLATES, async (event) => {
    const templates = await getTemplates()
    event.sender.send(IPC.RETURN_TEMPLATES, templates)
  })

  ipc.on(IPC.GET_TEMPLATE, async (event, templateId) => {
    const runtimeAddress = process.env.RUNTIME_ADDRESS
    const runtimeSecret = process.env.RUNTIME_SECRET
    const template = await getTemplate(templateId, runtimeAddress, runtimeSecret)
    event.sender.send(IPC.RETURN_TEMPLATE, template)
  })
}

export default attachEventListeners