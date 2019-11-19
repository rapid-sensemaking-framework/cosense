import React, { useEffect } from 'react'

export default function FormTextarea({ expectedInput, onChange }) {
  const { process, port, placeholder, defaultValue, label, shortLabel } = expectedInput
  const ident = `${process}--${port}`
  const innerOnChange = (evt) => {
    onChange(ident, evt.target.value)
  }

  useEffect(() => {
    // set default for parent
    onChange(ident, defaultValue)
  }, []) // only occurs on initialize

  return <div className="input-wrapper">
    <label htmlFor={ident}>{shortLabel}</label>
    <div className="input-help-label">{label}</div>
    <textarea id={ident} name={ident} placeholder={placeholder} defaultValue={defaultValue} onChange={innerOnChange}></textarea>
  </div>
}