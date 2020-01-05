import React, { useEffect, useState } from 'react'

export default function FormLimitPicker({ expectedInput, value, onChange }) {
  const { placeholder, defaultValue, label, shortLabel } = expectedInput

  const UNLIMITED_VAL = '*'
  const val = value || defaultValue || UNLIMITED_VAL

  const setFromTextInput = evt => {
    onChange(parseInt(evt.target.value))
  }

  useEffect(() => {
    // set default for parent
    onChange(val)
  }, []) // only occurs on initialize

  return (
    <div className='input-wrapper'>
      <label className='input-label'>{shortLabel}</label>
      <div className='input-help-label'>{label}</div>
      <button
        className={val !== UNLIMITED_VAL ? 'button button-white' : 'button'}
        onClick={() => onChange(UNLIMITED_VAL)}>
        Unlimited
      </button>
      <button
        className={val === UNLIMITED_VAL ? 'button button-white' : 'button'}
        onClick={() => onChange('')}>
        Limited
      </button>
      <input
        type='text'
        placeholder={placeholder}
        value={val === UNLIMITED_VAL ? '' : val}
        onChange={setFromTextInput}
      />
    </div>
  )
}
