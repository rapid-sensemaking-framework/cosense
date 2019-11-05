import * as electron from 'electron'
const ipc = electron.ipcMain

import {
  EVENTS
} from '../constants'
import {
  handleTemplateSubmit,
  getTemplate
} from './templates'
import {
  getProcess,
  getProcesses
} from './process_model'

const attachEventListeners = () => {
  ipc.on(EVENTS.IPC.HANDLE_TEMPLATE_SUBMIT, async (event, data) => {
    const processId = await handleTemplateSubmit(data)
    event.sender.send(EVENTS.IPC.TEMPLATE_SUBMIT_HANDLED, processId)
  })

  ipc.on(EVENTS.IPC.GET_PROCESS, async (event, processId) => {
    const process = await getProcess(processId)
    event.sender.send(EVENTS.IPC.RETURN_PROCESS, process)
  })

  ipc.on(EVENTS.IPC.GET_PROCESSES, async (event) => {
    const processes = await getProcesses()
    event.sender.send(EVENTS.IPC.RETURN_PROCESSES, processes)
  })

  ipc.on(EVENTS.IPC.GET_TEMPLATE, async (event, templateId) => {
    const runtimeAddress = process.env.RUNTIME_ADDRESS
    const runtimeSecret = process.env.RUNTIME_SECRET
    const template = await getTemplate(templateId, runtimeAddress, runtimeSecret)
    event.sender.send(EVENTS.IPC.RETURN_TEMPLATE, template)
  })
}

export default attachEventListeners