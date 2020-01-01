import React, { useState, useEffect } from 'react'
import './TemplateContactables.css'
import { CONTACTABLE_CONFIG_PORT_NAME } from '../../ts-built/constants'
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

export default function TemplateContactables({ template, formData, onChange }) {
  const expectedContactables = template.expectedInputs.find(
    e =>
      e.port === CONTACTABLE_CONFIG_PORT_NAME &&
      !e.process.includes('SendMessageToAll')
  )
  const REGISTER_METHOD_IDENT = 'register-method-ident'
  const EXISTING_LIST_IDENT = 'existing-list-ident'
  const CONTACTABLE_CONFIGS_IDENT = `${expectedContactables.process}--${expectedContactables.port}`

  const contactableConfigs = formData[CONTACTABLE_CONFIGS_IDENT]
  const configChoice = formData[REGISTER_METHOD_IDENT]
  const selectedList = formData[EXISTING_LIST_IDENT]

  const updateContactableConfigs = newContactableConfigs => {
    onChange(CONTACTABLE_CONFIGS_IDENT, newContactableConfigs)
  }
  // when you switch methods, reset things
  const setConfigChoice = choice => {
    onChange(REGISTER_METHOD_IDENT, choice)
    onChange(EXISTING_LIST_IDENT, null)
    updateContactableConfigs([])
  }
  const updateSelectedList = list => {
    onChange(EXISTING_LIST_IDENT, list)
    updateContactableConfigs(list ? list.participants : [])
  }

  const FROM_NEW_LIST = 'from_new_list'
  const NEW_LIST_LABEL = 'Configure participant list myself'

  const FROM_EXISTING_LIST = 'from_existing_list'
  const FROM_EXISTING_LABEL = 'Select an existing participant list'

  const PUBLIC_LINK = 'public_link'
  const PUBLIC_LINK_LABEL = 'Create a public link'

  const [participantLists, setParticipantLists] = useState([])

  const reset = () => {
    setConfigChoice('')
  }

  const updateParticipantLists = () => {
    getParticipantLists().then(lists => {
      setParticipantLists(lists)
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
            {configChoice === FROM_EXISTING_LIST && FROM_EXISTING_LABEL}
            {configChoice === FROM_NEW_LIST && NEW_LIST_LABEL}
            {configChoice === PUBLIC_LINK && PUBLIC_LINK_LABEL}
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
            label={FROM_EXISTING_LABEL}
            setConfigChoice={setConfigChoice}
          />
          <MethodRadio
            configChoice={configChoice}
            ident={PUBLIC_LINK}
            label={PUBLIC_LINK_LABEL}
            setConfigChoice={setConfigChoice}
          />
          <MethodRadio
            configChoice={configChoice}
            ident={FROM_NEW_LIST}
            label={NEW_LIST_LABEL}
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
      {configChoice === FROM_NEW_LIST && (
        <ParticipantListForm
          contactableConfigs={contactableConfigs}
          updateContactableConfigs={updateContactableConfigs}
        />
      )}
      {configChoice === PUBLIC_LINK && (
        <PublicLinkForm
          template={template}
          formData={formData}
          onChange={onChange}
        />
      )}
    </div>
  )
}
