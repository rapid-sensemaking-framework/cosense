import React from 'react'
import './PublicLinkForm.css'

import FormLimitPicker from '../forms/FormLimitPicker'
import FormTimePicker from '../forms/FormTimePicker'
import RegisterTypesConfig from '../RegisterTypesConfig'

export default function PublicLinkForm({ publicLink, updatePublicLink }) {
  const TITLE_KEY = 'title'
  const DESCRIPTION_KEY = 'description'
  const MAX_TIME_KEY = 'maxTime'
  const MAX_PARTICIPANTS_KEY = 'maxParticipants'
  const TYPES_KEY = 'types'

  const title = publicLink[TITLE_KEY]
  const description = publicLink[DESCRIPTION_KEY]
  const maxTime = publicLink[MAX_TIME_KEY]
  const maxParticipants = publicLink[MAX_PARTICIPANTS_KEY]
  const types = publicLink[TYPES_KEY]

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
        <div className='input-label'>Title</div>
        <div className='input-help-label'>
          Provide a welcoming title that will be presented in big text at the top of the page
        </div>
        <textarea
          value={title}
          onChange={evt => updatePublicLink(TITLE_KEY, evt.target.value)}
        />
      </div>
      <div className='input-wrapper'>
        <div className='input-label'>Description</div>
        <div className='input-help-label'>
          Write down a short description of what this flow
          is about and what it will involve (optional)
        </div>
        <textarea
          value={description}
          onChange={evt => updatePublicLink(DESCRIPTION_KEY, evt.target.value)}
        />
      </div>
      <div className='input-wrapper'>
        <RegisterTypesConfig types={types} onChange={val => updatePublicLink(TYPES_KEY, val)} />
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
