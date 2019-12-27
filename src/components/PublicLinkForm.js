import React from 'react'

import './PublicLinkForm.css'

export default function PublicLinkForm({ template, formData, onChange }) {
  // TODO: fix this
  const expectedInput = {}
  const { process } = expectedInput

  const processContextIdent = `${process}-ParticipantRegister-process_context`
  const maxTimeIdent = `${process}-ParticipantRegister-max_time`
  const maxParticipantsIdent = `${process}-ParticipantRegister-max_participants`

  return (
    <div className='public-link-form'>
      <div className='input-wrapper'>
        <div className='input-label'>Description in the link</div>
        <div className='input-help-label'>
          Write down a short description of what this rapid sense making process
          is about (optional)
        </div>
        <textarea
          id={processContextIdent}
          name={processContextIdent}
          onChange={evt => onChange(processContextIdent, evt.target.value)}
        />
      </div>
      <div className='input-wrapper'>
        <div className='input-label'>Number of participants</div>
        <div className='input-help-label'>
          Maximum number of participants who can resister
        </div>
        <input
          type='text'
          id={maxParticipantsIdent}
          name={maxParticipantsIdent}
          onChange={evt => onChange(maxParticipantsIdent, evt.target.value)}
        />
      </div>
      <div className='input-wrapper'>
        <div className='input-label'>Time allowed for registration</div>
        <div className='input-help-label'>
          Time you’d like to leave for participants to register
        </div>
        <input
          type='text'
          id={maxTimeIdent}
          name={maxTimeIdent}
          onChange={evt => onChange(maxTimeIdent, evt.target.value)}
        />
      </div>
    </div>
  )
}
