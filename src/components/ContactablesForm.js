import React, { useState } from 'react'
import ContactableInput from './ContactableInput'
import './ContactablesForm.css'

export default function ContactablesForm({ onSubmit }) {
  const [els, setEls] = useState([{}])
  const updateEl = (val, index) => {
    const newEls = els.slice(0) // clone
    newEls[index] = val
    setEls(newEls)
  }
  const removeEl = (index) => {
    const newEls = els.slice(0) // clone
    newEls.splice(index, 1)
    setEls(newEls)
  }
  const innerOnSubmit = (e) => {
    e.preventDefault()
    onSubmit(els)
  }
  const clickAddOne = (e) => {
    e.preventDefault()
    setEls(els.concat([{}]))
  }
  return <div className="contactables-form">
    <div className="input-label">Configure your participants</div>
    <div className="input-help-label">
      Select participants and their communication platform for participation or select a pre-existing list.
    </div>
    <button className="participant-list-button">Choose Participant List</button>
    {els.map((id, index) => {
      return <ContactableInput
        showRemove={els.length > 1}
        key={index}
        onChange={(val) => updateEl(val, index)}
        onRemove={() => removeEl(index)} />
    })}
    <button className="add-more-button" onClick={clickAddOne}>Add More</button>
  </div>
}
