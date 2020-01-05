import React from 'react'
import { FROM_PUBLIC_LINK } from '../../ts-built/process-config'
import ParticipantRegister from '../ParticipantRegister'
import './TemplateSubmit.css'

export default function TemplateSubmit({
  processConfig,
  startNow,
  startLater
}) {
  const { participantsConfig } = processConfig
  const { method } = participantsConfig

  const labelText =
    method === FROM_PUBLIC_LINK
      ? 'Do you want to open registration now?'
      : 'Do you want to start the process now and send the prompts to the participants?'
  const helpLabelText =
    method === FROM_PUBLIC_LINK
      ? 'The time count down will start for participants to register at the link.'
      : 'Prompts will be sent to participants right away and the time countdown for submitting responses will start.'
  return (
    <div className='template-submit'>
      <div className='template-submit-header'>Your flow is ready!</div>
      {method === FROM_PUBLIC_LINK && (
        <div className='participant-register-wrapper'>
          <ParticipantRegister
            participantRegisterConfig={participantsConfig.publicLink}
          />
        </div>
      )}
      <div className='input-wrapper'>
        <div className='input-label'>{labelText}</div>
        <div className='input-help-label'>{helpLabelText}</div>
        <button className='button button-white' onClick={startLater}>
          No, I want to start later
        </button>
        <button className='button' onClick={startNow}>
          Yes, start now
        </button>
      </div>
    </div>
  )
}
