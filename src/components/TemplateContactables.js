import React, { useState, useEffect } from 'react'
import { CONTACTABLE_CONFIG_PORT_NAME } from '../ts-built/constants'
import ContactableInput from './ContactableInput'
import './TemplateContactables.css'

export default function ContactablesForm({ template, onChange }) {
  const [els, setEls] = useState([{}])

  const expectedContactables = template.expectedInputs
    .filter((e) => e.port === CONTACTABLE_CONFIG_PORT_NAME)

  useEffect(() => {
    expectedContactables.forEach(expectedInput => {
      const { process, port } = expectedInput
      const ident = `${process}--${port}`
      onChange(ident, JSON.stringify(els))
    })
  }, [els])

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
  const clickAddOne = (e) => {
    e.preventDefault()
    setEls(els.concat([{}]))
  }
  return <div className="contactables-form">
    <div className="input-label">Configure your participants</div>
    <div className="input-help-label">
      List participants and their communication platform for participation.
    </div>
    {/* Select participants and their communication platform for participation or select a pre-existing list. */}
    {/* <button className="participant-list-button">Choose Participant List</button> */}
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
