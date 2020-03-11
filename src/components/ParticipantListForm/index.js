import React, { useState, useEffect } from 'react'
import ContactableInput from '../ContactableInput'
import './ParticipantListForm.css'

import Modal from '../Modal'
import { guidGenerator } from '../../ts-built/utils'
import { createParticipantList } from '../../ipc'

function ListSaverModal({ cancel, save }) {
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const saveList = () => {
    save(name)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      cancel()
    }, 3000)
  }

  const inputId = 'participant-list-name-input'

  return (
    <Modal cancel={cancel}>
      <div className='participant-list-saver'>
        <div className='input-label'>Save Participant List</div>
        <div className='input-help-label'>
          You will be able to use the list for future forms
        </div>

        <label className='participant-list-name-label' htmlFor={inputId}>
          participant list name
        </label>
        <input
          id={inputId}
          type='text'
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <div className='participant-list-buttons'>
          <button className='participant-list-save-button' onClick={saveList}>
            Save{saved && 'd'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default function ParticipantListForm({
  contactableConfigs,
  updateContactableConfigs
}) {
  const [saveList, setSaveList] = useState(false)

  // set defaults
  useEffect(() => {
    const defaults = [{}]
    updateContactableConfigs(defaults)
  }, []) // only on mount

  const updateEl = (val, index) => {
    const newEls = contactableConfigs.slice(0) // clone
    newEls[index] = val
    updateContactableConfigs(newEls)
  }
  const removeEl = index => {
    const newEls = contactableConfigs.slice(0) // clone
    newEls.splice(index, 1)
    updateContactableConfigs(newEls)
  }
  const clickAddOne = e => {
    e.preventDefault()
    updateContactableConfigs(contactableConfigs.concat([{}]))
  }

  const save = async name => {
    const list = {
      name,
      slug: guidGenerator(),
      createdAt: Date.now(),
      participants: contactableConfigs.slice(0)
    }
    await createParticipantList(list)
  }

  return (
    <div className='contactables-form'>
      {contactableConfigs &&
        contactableConfigs.map((el, index) => {
          return (
            <ContactableInput
              contactable={el}
              showRemove={contactableConfigs.length > 1}
              onChange={val => updateEl(val, index)}
              onRemove={() => removeEl(index)}
            />
          )
        })}
      <button className='button add-more-button' onClick={clickAddOne}>
        Add More
      </button>
      <button className='button button-white' onClick={() => setSaveList(true)}>
        Save List
      </button>
      {saveList && (
        <ListSaverModal cancel={() => setSaveList(false)} save={save} />
      )}
    </div>
  )
}
