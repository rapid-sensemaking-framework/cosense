import * as electron from 'electron'
import * as socketClient from 'socket.io-client'
import {
  ContactableConfig,
  ParticipantRegisterData
} from 'rsf-types'

import {
  EVENTS
} from '../constants'

const ipc = electron.ipcMain

// ipc local
const getContactablesFromFacilitator = (id: string): Promise<ContactableConfig[]> => {
  return new Promise((resolve) => {
    ipc.once(EVENTS.IPC.HANDLE_FACIL_CONTACTABLES_SUBMIT(id), (event, contactableConfigs: ContactableConfig[]) => {
      resolve(contactableConfigs)
      // synchronously return
      event.returnValue = true
    })
  })
}

// websockets to remote
const getContactablesFromRegistration = (
    wsUrl: string,
    id: string,
    maxTime: number,
    maxParticipants: any,
    processDescription: string,
    eachNew: (newParticipant: ContactableConfig) => void = () => {} // set default
  ): Promise<ContactableConfig[]> => {
  return new Promise((resolve) => {

    const participantRegisterData: ParticipantRegisterData = {
      id,
      maxParticipants,
      maxTime,
      processDescription
    }
    // TODO: handle timeout
    // capture the process kickoff time for reference
    // const startTime = Date.now()
    const socket = socketClient(wsUrl)
    socket.on('connect', () => {
      // initialize it
      socket.emit(EVENTS.SEND.PARTICIPANT_REGISTER, participantRegisterData)
    })
    // single one
    socket.on(EVENTS.RECEIVE.PARTICIPANT_REGISTER_RESULT, eachNew)
    // all results
    socket.on(EVENTS.RECEIVE.PARTICIPANT_REGISTER_RESULTS, resolve)
  })
}




export {
  getContactablesFromFacilitator,
  getContactablesFromRegistration
}
