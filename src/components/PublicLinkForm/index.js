import React from 'react'
import './PublicLinkForm.css'

import FormLimitPicker from '../forms/FormLimitPicker'
import FormTimePicker from '../forms/FormTimePicker'

export default function PublicLinkForm({ template, formData, onChange }) {
  const PROCESS_DESCRIPTION_IDENT = 'public-link--process-description'

  const participantLimitInput = {
    process: 'public-link',
    port: 'participant-limit',
    shortLabel: 'Number of participants',
    label: 'Maximum number of participants who can register'
  }
  const timeLimitInput = {
    process: 'public-link',
    port: 'time-limit',
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
          id={PROCESS_DESCRIPTION_IDENT}
          name={PROCESS_DESCRIPTION_IDENT}
          onChange={evt =>
            onChange(PROCESS_DESCRIPTION_IDENT, evt.target.value)
          }
        />
      </div>
      <div className='input-row'>
        <div className='input-wrapper'>
          <FormLimitPicker
            expectedInput={participantLimitInput}
            onChange={onChange}
          />
        </div>
        <div className='input-wrapper'>
          <FormTimePicker expectedInput={timeLimitInput} onChange={onChange} />
        </div>
      </div>
    </div>
  )
}
