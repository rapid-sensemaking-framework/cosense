import React, { useState } from 'react'
import ContactableInput from './ContactableInput'

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
  return <form onSubmit={innerOnSubmit}>
    {els.map((id, index) => {
      return <ContactableInput
        showRemove={els.length > 1}
        key={index}
        onChange={(val) => updateEl(val, index)}
        onRemove={() => removeEl(index)} />
    })}
    <button className="button button-clear" onClick={clickAddOne}>Add One</button>
    <input className="button float-right" type="submit" value="Submit"></input>
  </form>
}
