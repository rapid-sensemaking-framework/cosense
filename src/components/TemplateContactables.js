import React, { useState, useEffect } from 'react'
import './TemplateContactables.css'

import ParticipantListForm from './ParticipantListForm'
import PublicLinkForm from './PublicLinkForm'

export default function TemplateContactables({ template, formData, onChange }) {
  const [selectMethod, setSelectMethod] = useState(true)

  const fromNewList = 'from_new_list'
  const fromExistingList = 'from_existing_list'
  const publicLinkString = 'public_choice'

  const [configChoice, setConfigChoice] = useState()

  const newListIdent = `new-list-ident`
  const existlingListIdent = `existing-list-ident`
  const publicLinkIdent = `public-link-ident`

  const pickFromNewList = () => {
    setConfigChoice(fromNewList)
    onChange(newListIdent, fromNewList)
    onChange(existlingListIdent, '')
    onChange(publicLinkIdent, '')
    setSelectMethod(false)
  }
  const pickFromExistingList = () => {
    setConfigChoice(fromExistingList)
    onChange(existlingListIdent, fromExistingList)
    onChange(newListIdent, '')
    onChange(publicLinkIdent, '')
    setSelectMethod(false)
  }
  const pickPublicLink = () => {
    setConfigChoice(publicLinkString)
    onChange(publicLinkIdent, publicLinkString)
    onChange(newListIdent, '')
    onChange(existlingListIdent, '')
    setSelectMethod(false)
  }

  const reset = () => {
    setSelectMethod(true)
    setConfigChoice('')
  }

  useEffect(() => {
    // set default for parent
    onChange(newListIdent, fromNewList)
  }, []) // only occurs on initialize

  const fromExistingLabel = 'Select an existing participant list'
  const publicLinkLabel = 'Create a public link'
  const newListLabel = 'Configure participant list myself'

  return (
    <div className='template-contactables'>
      <div className='input-label'>Configure your participants</div>
      {!selectMethod && (
        <div className='contactables-selected-method'>
          <div className='contactables-selected-method-selected'>
            {configChoice === fromExistingList && fromExistingLabel}
            {configChoice === fromNewList && newListLabel}
            {configChoice === publicLinkString && publicLinkLabel}
          </div>
          <div className='contactables-selected-method-change' onClick={reset}>
            change
          </div>
        </div>
      )}
      {selectMethod && (
        <div className='input-help-label'>
          First, choose how you would like to share the prompts with the
          participants
        </div>
      )}
      {selectMethod && (
        <div className='contactables-select-method'>
          <div>
            <input
              type='radio'
              value={fromExistingList}
              id={fromExistingList}
              name={fromExistingList}
              checked={configChoice === fromExistingList}
              onChange={pickFromExistingList}
            />
            <label className='label-inline' htmlFor={fromExistingList}>
              {fromExistingLabel}
            </label>
          </div>

          <div>
            <input
              type='radio'
              value={publicLinkString}
              id={publicLinkIdent}
              name={publicLinkIdent}
              checked={configChoice === publicLinkString}
              onChange={pickPublicLink}
            />
            <label className='label-inline' htmlFor={publicLinkIdent}>
              {publicLinkLabel}
            </label>
          </div>

          <div>
            <input
              type='radio'
              value={fromNewList}
              id={newListIdent}
              name={newListIdent}
              checked={configChoice === fromNewList}
              onChange={pickFromNewList}
            />
            <label className='label-inline' htmlFor={newListIdent}>
              {newListLabel}
            </label>
          </div>
        </div>
      )}

      {configChoice === fromNewList && (
        <ParticipantListForm
          template={template}
          formData={formData}
          onChange={onChange}
        />
      )}
      {configChoice === publicLinkString && (
        <PublicLinkForm
          template={template}
          formData={formData}
          onChange={onChange}
        />
      )}
    </div>
  )
}
