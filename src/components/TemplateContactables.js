import React, { useState, useEffect } from 'react'
import './TemplateContactables.css'

import ParticipantListPicker from './ParticipantListPicker'
import ParticipantListForm from './ParticipantListForm'
import PublicLinkForm from './PublicLinkForm'

import { getParticipantLists } from '../ipc'

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
  const fromNewList = 'from_new_list'
  const newListLabel = 'Configure participant list myself'

  const fromExistingList = 'from_existing_list'
  const fromExistingLabel = 'Select an existing participant list'

  const publicLink = 'public_link'
  const publicLinkLabel = 'Create a public link'

  const REGISTER_METHOD_IDENT = 'register-method-ident'
  const configChoice = formData[REGISTER_METHOD_IDENT]
  const setConfigChoice = choice => {
    onChange(REGISTER_METHOD_IDENT, choice)
  }
  const [participantLists, setParticipantLists] = useState([])

  const reset = () => {
    setConfigChoice('')
  }

  useEffect(() => {
    getParticipantLists().then(lists => {
      setParticipantLists(lists)
    })
  }, [])

  const selectMethod = !configChoice

  return (
    <div className='template-contactables'>
      <div className='input-label'>Configure your participants</div>
      {!selectMethod && (
        <div className='contactables-selected-method'>
          <div className='contactables-selected-method-selected'>
            {configChoice === fromExistingList && fromExistingLabel}
            {configChoice === fromNewList && newListLabel}
            {configChoice === publicLink && publicLinkLabel}
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
            ident={fromExistingList}
            label={fromExistingLabel}
            setConfigChoice={setConfigChoice}
          />
          <MethodRadio
            configChoice={configChoice}
            ident={publicLink}
            label={publicLinkLabel}
            setConfigChoice={setConfigChoice}
          />
          <MethodRadio
            configChoice={configChoice}
            ident={fromNewList}
            label={newListLabel}
            setConfigChoice={setConfigChoice}
          />
        </div>
      )}
      {configChoice === fromExistingList && (
        <ParticipantListPicker
          template={template}
          formData={formData}
          onChange={onChange}
          participantLists={participantLists}
          cancel={reset}
        />
      )}
      {configChoice === fromNewList && (
        <ParticipantListForm
          template={template}
          formData={formData}
          onChange={onChange}
        />
      )}
      {configChoice === publicLink && (
        <PublicLinkForm
          template={template}
          formData={formData}
          onChange={onChange}
        />
      )}
    </div>
  )
}
