import React, { useEffect } from 'react'

export default function FormBoolean({ expectedInput, value, onChange }) {
  const { defaultValue, label, shortLabel } = expectedInput

  const val = value || defaultValue

  useEffect(() => {
    // set default for parent
    onChange(val)
  }, []) // only occurs on initialize

  return (
    <div className='input-wrapper'>
      <label className='input-label'>{shortLabel}</label>
      <div className='input-help-label'>{label}</div>
      <button
        className={val ? 'button' : 'button button-white'}
        onClick={() => onChange(true)}>
        Yes
      </button>
      <button
        className={val ? 'button button-white' : 'button'}
        onClick={() => onChange(false)}>
        No
      </button>
    </div>
  )
}
