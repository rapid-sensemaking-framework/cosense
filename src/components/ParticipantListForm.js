import React, { useEffect } from 'react'
import { CONTACTABLE_CONFIG_PORT_NAME } from '../ts-built/constants'
import ContactableInput from './ContactableInput'
import './ParticipantListForm.css'

export default function FormRegisterConfig({ template, formData, onChange }) {
  const expectedContactables = template.expectedInputs.find(
    e =>
      e.port === CONTACTABLE_CONFIG_PORT_NAME &&
      !e.process.includes('SendMessageToAll')
  )
  const ident = `${expectedContactables.process}--${expectedContactables.port}`
  const els = formData[ident]

  // set defaults
  useEffect(() => {
    const defaults = [{}]
    onChange(ident, defaults)
  }, []) // only on mount

  const updateEl = (val, index) => {
    const newEls = els.slice(0) // clone
    newEls[index] = val
    onChange(ident, newEls)
  }
  const removeEl = index => {
    const newEls = els.slice(0) // clone
    newEls.splice(index, 1)
    onChange(ident, newEls)
  }
  const clickAddOne = e => {
    e.preventDefault()
    onChange(ident, els.concat([{}]))
  }

  const clickSaveList = () => {
    console.log('save list')
  }
  return (
    <div className='contactables-form'>
      {/* Select participants and their communication platform for participation or select a pre-existing list. */}
      {/* <button className="participant-list-button">Choose Participant List</button> */}
      {els &&
        els.map((el, index) => {
          return (
            <ContactableInput
              contactable={el}
              showRemove={els.length > 1}
              onChange={val => updateEl(val, index)}
              onRemove={() => removeEl(index)}
            />
          )
        })}
      <button className='button add-more-button' onClick={clickAddOne}>
        Add More
      </button>
      <button className='button' onClick={clickSaveList}>
        Save List
      </button>
    </div>
  )
}
