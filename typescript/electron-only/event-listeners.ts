import * as electron from 'electron'
const ipc = electron.ipcMain

import {
  EVENTS
} from '../react-electron/constants'
import {
  handleTemplateSubmit
} from './templates'
import {
  getProcess
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
}

export default attachEventListeners