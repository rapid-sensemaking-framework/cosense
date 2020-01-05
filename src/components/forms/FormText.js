import React, { useEffect } from 'react'

export default function FormText({ expectedInput, value, onChange }) {
  const { placeholder, defaultValue, label, shortLabel } = expectedInput
  const innerOnChange = evt => {
    onChange(evt.target.value)
  }

  const val = value || defaultValue

  useEffect(() => {
    // set default for parent
    onChange(val)
  }, []) // only occurs on initialize

  return (
    <div className='input-wrapper'>
      <label className='input-label'>{shortLabel}</label>
      <div className='input-help-label'>{label}</div>
      <input
        type='text'
        placeholder={placeholder}
        value={val}
        onChange={innerOnChange}
      />
    </div>
  )
}
