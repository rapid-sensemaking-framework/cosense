import React, { useState, useEffect } from 'react'
import './TemplateContactables.css'
import {
  FROM_EXISTING_LIST,
  FROM_PUBLIC_LINK,
  FROM_CUSTOM_LIST
} from '../../ts-built/process-config'
import ParticipantListPicker from '../ParticipantListPicker'
import ParticipantListForm from '../ParticipantListForm'
import PublicLinkForm from '../PublicLinkForm'

import { getParticipantLists } from '../../ipc'

function MethodRadio({ configChoice, ident, label, setConfigChoice }) {
  return (
    <div>
      <input
        type='radio'
        id={ident}
        checked={configChoice === ident}
        onChange={() => setConfigChoice(ident)}
      />
      <label className='label-inline' htmlFor={ident}>
        {label}
      </label>
    </div>
  )
}

export default function TemplateContactables({
  processConfig: { participantsConfig },
  updateParticipantsConfig,
  template
}) {
  const METHOD_KEY = 'method'
  const PARTICIPANTS_KEY = 'participants'
  const PARTICIPANT_LIST_KEY = 'participantList'
  const PUBLIC_LINK_KEY = 'publicLink'
  const configChoice = participantsConfig[METHOD_KEY]
  const contactableConfigs = participantsConfig[PARTICIPANTS_KEY]
  const selectedList = participantsConfig[PARTICIPANT_LIST_KEY]
  const publicLink = participantsConfig[PUBLIC_LINK_KEY]

  const updateContactableConfigs = newContactableConfigs => {
    updateParticipantsConfig(PARTICIPANTS_KEY, newContactableConfigs)
  }
  // when you switch methods, reset things
  const setConfigChoice = choice => {
    updateParticipantsConfig(METHOD_KEY, choice)
    updateParticipantsConfig(PARTICIPANT_LIST_KEY, null)
    updateContactableConfigs([])
  }
  const updateSelectedList = list => {
    updateParticipantsConfig(PARTICIPANT_LIST_KEY, list)
    updateContactableConfigs(list ? list.participants : [])
  }

  const FROM_CUSTOM_LIST_LABEL = 'Configure participant list myself'
  const FROM_EXISTING_LIST_LABEL = 'Select an existing participant list'
  const FROM_PUBLIC_LINK_LABEL = 'Create a public link'

  const [participantLists, setParticipantLists] = useState([])

  const reset = () => {
    setConfigChoice('')
  }

  const updateParticipantLists = () => {
    getParticipantLists().then(lists => {
      setParticipantLists(lists)
    })
  }

  const updatePublicLink = (key, value) => {
    updateParticipantsConfig(PUBLIC_LINK_KEY, {
      ...publicLink,
      [key]: value
    })
  }

  // on init, setup 3 second fetcher
  useEffect(() => {
    const fetchIntervalId = setInterval(updateParticipantLists, 3000)
    updateParticipantLists()
    return function cleanup() {
      clearInterval(fetchIntervalId)
    }
  }, [])

  const selectMethod = !configChoice

  return (
    <div className='template-contactables'>
      <div className='input-label'>Configure your participants</div>
      {!selectMethod && (
        <div className='contactables-selected-method'>
          <div className='contactables-selected-method-selected'>
            {configChoice === FROM_EXISTING_LIST && FROM_EXISTING_LIST_LABEL}
            {configChoice === FROM_CUSTOM_LIST && FROM_CUSTOM_LIST_LABEL}
            {configChoice === FROM_PUBLIC_LINK && FROM_PUBLIC_LINK_LABEL}
          </div>
          <div className='contactables-selected-method-change' onClick={reset}>
            change
          </div>
        </div>
      )}
      {selectMethod && (
        <div className='input-help-label'>
          First, choose the method you'll use to enroll participants
        </div>
      )}
      {selectMethod && (
        <div className='contactables-select-method'>
          <MethodRadio
            configChoice={configChoice}
            ident={FROM_EXISTING_LIST}
            label={FROM_EXISTING_LIST_LABEL}
            setConfigChoice={setConfigChoice}
          />
          <MethodRadio
            configChoice={configChoice}
            ident={FROM_PUBLIC_LINK}
            label={FROM_PUBLIC_LINK_LABEL}
            setConfigChoice={setConfigChoice}
          />
          <MethodRadio
            configChoice={configChoice}
            ident={FROM_CUSTOM_LIST}
            label={FROM_CUSTOM_LIST_LABEL}
            setConfigChoice={setConfigChoice}
          />
        </div>
      )}
      {configChoice === FROM_EXISTING_LIST && (
        <ParticipantListPicker
          contactableConfigs={contactableConfigs}
          selectedList={selectedList}
          updateSelectedList={updateSelectedList}
          participantLists={participantLists}
          cancel={reset}
        />
      )}
      {configChoice === FROM_CUSTOM_LIST && (
        <ParticipantListForm
          contactableConfigs={contactableConfigs}
          updateContactableConfigs={updateContactableConfigs}
        />
      )}
      {configChoice === FROM_PUBLIC_LINK && (
        <PublicLinkForm
          template={template}
          publicLink={publicLink}
          updatePublicLink={updatePublicLink}
        />
      )}
    </div>
  )
}
