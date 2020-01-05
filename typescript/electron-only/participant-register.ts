import * as socketClient from 'socket.io-client'
import { ContactableConfig, ParticipantRegisterConfig } from 'rsf-types'

import { EVENTS } from '../constants'
import { getRegisterAddress } from '../utils'

const createParticipantRegister = (
  participantRegisterConfig: ParticipantRegisterConfig
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const registerWsUrl = getRegisterAddress(
      process.env,
      'REGISTER_WS_PROTOCOL'
    )
    const socket = socketClient(registerWsUrl)
    socket.on('connect', async () => {
      socket.emit(EVENTS.SEND.PARTICIPANT_REGISTER, participantRegisterConfig)
      socket.disconnect()
      resolve()
    })
  })
}

// websockets to remote
const getContactablesFromRegistration = (
  id: string,
  eachNew: (newParticipant: ContactableConfig) => void = () => {} // set default
): Promise<ContactableConfig[]> => {
  return new Promise((resolve, reject) => {
    const registerWsUrl = getRegisterAddress(
      process.env,
      'REGISTER_WS_PROTOCOL'
    )

    // TODO: handle timeout
    // capture the process kickoff time for reference
    // const startTime = Date.now()
    const socket = socketClient(registerWsUrl)
    socket.on('connect', async () => {
      // kick it off
      socket.emit(EVENTS.SEND.OPEN_REGISTER, id)
    })
    // single one
    socket.on(EVENTS.RECEIVE.PARTICIPANT_REGISTER_RESULT, eachNew)
    // all results
    socket.on(
      EVENTS.RECEIVE.PARTICIPANT_REGISTER_RESULTS,
      (participants: ContactableConfig[]) => {
        socket.disconnect()
        resolve(participants)
      }
    )
  })
}

export { createParticipantRegister, getContactablesFromRegistration }
