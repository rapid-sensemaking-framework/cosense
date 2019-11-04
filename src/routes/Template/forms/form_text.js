import React, { useEffect } from 'react'

export default function ContactableForm({ expectedInput, onChange }) {
  const { process, port, placeholder, defaultValue, label } = expectedInput
  const ident = `${process}--${port}`
  const innerOnChange = (evt) => {
    onChange(ident, evt.target.value)
  }

  useEffect(() => {
    // set default for parent
    onChange(ident, defaultValue)
  }, []) // only occurs on initialize

  return <div>
    <label htmlFor={ident}>{label}</label>
    <input type="text"  id={ident} name={ident} placeholder={placeholder} value={defaultValue} onChange={innerOnChange} />
  </div>
}