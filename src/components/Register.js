import React from 'react'
import {
  remainingTime,
  getRegisterAddress
} from '../ts-built/utils'
import {
  URLS
} from '../ts-built/constants'
import {
  getElectron
} from '../electron-require'
import ContactablesForm from './ContactablesForm'
import RegisterLink from './RegisterLink'

const electron = getElectron()

export default function Register({ registerConfig, participants, startTime, sendContactableConfigs }) {

  const timeLeft = remainingTime(registerConfig.maxTime, startTime)
  const onSubmit = (contactableConfigs) => {
    sendContactableConfigs(registerConfig.id, contactableConfigs)
  }
  const hostUrl = getRegisterAddress(electron.remote.process.env, 'REGISTER_HTTP_PROTOCOL')
  const url = hostUrl + URLS.REGISTER(registerConfig.id)

  return <>
    {!registerConfig.isFacilitator && <RegisterLink timeLeft={timeLeft} url={url} />}
    {registerConfig.isFacilitator && participants.length === 0 && <ContactablesForm onSubmit={onSubmit} />}
    {participants.length > 0 && <div>
      <h5>participants</h5>
      <ol>
        {participants.map((participant, participantIndex) => {
          return <li key={`participant-${participantIndex}`}>
            type: {participant.type}, id: {participant.id}
          </li>
        })}
      </ol>
    </div>}
  </>
}
