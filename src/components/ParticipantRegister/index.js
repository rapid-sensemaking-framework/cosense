import React, { useState, useRef } from 'react'
import { remainingTime, getRegisterAddress } from '../../ts-built/utils'
import { URLS } from '../../ts-built/constants'
import { getElectron } from '../../electron-require'
import './ParticipantRegister.css'
import TimeCountdown from '../TimeCountdown'

const { shell, remote, clipboard } = getElectron()

export default function ParticipantRegister({
  participantRegisterConfig,
  reachedParticipantLimit,
  startTime
}) {
  const { maxTime, id } = participantRegisterConfig
  const hostUrl = getRegisterAddress(
    remote.process.env,
    'REGISTER_HTTP_PROTOCOL'
  )
  const url = hostUrl + URLS.REGISTER(id)

  const timeLeft =
    startTime && maxTime ? remainingTime(maxTime, startTime) : null
  const [timeOver, setTimeOver] = useState(timeLeft === 0)
  const inputEl = useRef(null)

  const onClickPreview = e => {
    e.preventDefault()
    shell.openExternal(url)
  }
  const onClickCopy = () => {
    clipboard.writeText(url)
  }
  const onInputFocus = () => {
    inputEl.current.select()
  }

  return (
    <>
      <div className='input-label'>Here is your public link to share</div>
      {startTime && maxTime && !reachedParticipantLimit && !timeOver && (
        <p>
          Registration will remain open for{' '}
          <TimeCountdown seconds={timeLeft} over={() => setTimeOver(true)} />.
        </p>
      )}
      {timeOver && !reachedParticipantLimit && (
        <p>Registration is now closed.</p>
      )}
      {reachedParticipantLimit && (
        <p>
          Registration has closed because the participant limit was reached.
        </p>
      )}
      <div className='public-link-details'>
        <input
          ref={inputEl}
          type='text'
          readOnly
          value={url}
          onFocus={onInputFocus}></input>
        <button className='button' onClick={onClickCopy}>
          copy link
        </button>
        <button className='button' onClick={onClickPreview}>
          preview
        </button>
      </div>
    </>
  )
}
