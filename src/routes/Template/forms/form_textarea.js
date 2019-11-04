import React, { useEffect } from 'react'

export default function Textarea({ expectedInput, onChange }) {
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
    <textarea id={ident} name={ident} placeholder={placeholder} defaultValue={defaultValue} onChange={innerOnChange}></textarea>
  </div>
}