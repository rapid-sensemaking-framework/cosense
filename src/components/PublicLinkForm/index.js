import React from 'react'
import './PublicLinkForm.css'

import FormLimitPicker from '../forms/FormLimitPicker'
import FormTimePicker from '../forms/FormTimePicker'

export default function PublicLinkForm({ publicLink, updatePublicLink }) {
  const DESCRIPTION_KEY = 'description'
  const MAX_TIME_KEY = 'maxTime'
  const MAX_PARTICIPANTS_KEY = 'maxParticipants'

  const description = publicLink[DESCRIPTION_KEY]
  const maxTime = publicLink[MAX_TIME_KEY]
  const maxParticipants = publicLink[MAX_PARTICIPANTS_KEY]

  const participantLimitInput = {
    shortLabel: 'Number of participants',
    label: 'Maximum number of participants who can register'
  }
  const timeLimitInput = {
    shortLabel: 'Time allowed for registration',
    label: 'Time you’d like to leave for participants to register'
  }

  return (
    <div className='public-link-form'>
      <div className='link-delivery'>You’ll get the link after you submit</div>
      <div className='input-wrapper'>
        <div className='input-label'>Description in the link</div>
        <div className='input-help-label'>
          Write down a short description of what this rapid sensemaking process
          is about and what it will involve (optional)
        </div>
        <textarea
          value={description}
          onChange={evt => updatePublicLink(DESCRIPTION_KEY, evt.target.value)}
        />
      </div>
      <div className='input-row'>
        <div className='input-wrapper'>
          <FormLimitPicker
            value={maxParticipants}
            expectedInput={participantLimitInput}
            onChange={val => updatePublicLink(MAX_PARTICIPANTS_KEY, val)}
          />
        </div>
        <div className='input-wrapper'>
          <FormTimePicker
            value={maxTime}
            expectedInput={timeLimitInput}
            onChange={val => updatePublicLink(MAX_TIME_KEY, val)}
          />
        </div>
      </div>
    </div>
  )
}
