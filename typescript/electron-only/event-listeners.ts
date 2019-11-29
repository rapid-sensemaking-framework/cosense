import * as electron from 'electron'
const ipc = electron.ipcMain

import {
  EVENTS
} from '../constants'
import {
  TemplateSubmitInput,
  UpdateTemplateInput,
  GetTemplateInput
} from '../types'
import {
  updateTemplate,
  createProcess,
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

// TODO handle failure cases

const attachEventListeners = () => {
  ipc.on(IPC.UPDATE_TEMPLATE, async (event: electron.IpcMessageEvent, data: UpdateTemplateInput) => {
    await updateTemplate(data)
    event.sender.send(IPC.TEMPLATE_UPDATED)
  })

  ipc.on(IPC.CREATE_PROCESS, async (event: electron.IpcMessageEvent, data: TemplateSubmitInput) => {
    const processId = await createProcess(data)
    event.sender.send(IPC.PROCESS_CREATED, processId)
  })

  ipc.on(IPC.RUN_PROCESS, async (event: electron.IpcMessageEvent, processId: string) => {
    const runtimeAddress = process.env.RUNTIME_ADDRESS
    const runtimeSecret = process.env.RUNTIME_SECRET
    // start process, but don't wait for it before returning
    runProcess(processId, runtimeAddress, runtimeSecret)
    event.sender.send(IPC.PROCESS_RUNNING)
  })

  ipc.on(IPC.CLONE_PROCESS, async (event: electron.IpcMessageEvent, processId: string) => {
    const newProcessId = await cloneProcess(processId)
    event.sender.send(IPC.PROCESS_CLONED, newProcessId)
  })

  ipc.on(IPC.CLONE_TEMPLATE, async (event: electron.IpcMessageEvent, templateId: string) => {
    const newTemplateId = await cloneTemplate(templateId)
    event.sender.send(IPC.TEMPLATE_CLONED, newTemplateId)
  })

  ipc.on(IPC.GET_PROCESS, async (event: electron.IpcMessageEvent, processId: string) => {
    const process = await getProcess(processId)
    event.sender.send(IPC.RETURN_PROCESS, process)
  })

  ipc.on(IPC.GET_PROCESSES, async (event: electron.IpcMessageEvent) => {
    const processes = await getProcesses()
    event.sender.send(IPC.RETURN_PROCESSES, processes)
  })

  ipc.on(IPC.GET_SYSTEM_TEMPLATES, async (event: electron.IpcMessageEvent) => {
    const templates = await getTemplates(false)
    event.sender.send(IPC.RETURN_SYSTEM_TEMPLATES, templates)
  })

  ipc.on(IPC.GET_USER_TEMPLATES, async (event: electron.IpcMessageEvent) => {
    const templates = await getTemplates(true)
    event.sender.send(IPC.RETURN_USER_TEMPLATES, templates)
  })

  ipc.on(IPC.GET_TEMPLATE, async (event: electron.IpcMessageEvent, data: GetTemplateInput) => {
    const { templateId, userDefined } = data
    const runtimeAddress = process.env.RUNTIME_ADDRESS
    const runtimeSecret = process.env.RUNTIME_SECRET
    const template = await getTemplate(templateId, userDefined, runtimeAddress, runtimeSecret)
    event.sender.send(IPC.RETURN_TEMPLATE, template)
  })
}

export default attachEventListeners