import React, { useEffect, useState } from 'react'

export default function FormTimePicker({ expectedInput, value, onChange }) {
  const { placeholder, defaultValue, label, shortLabel } = expectedInput

  const val = value || defaultValue

  // intended onChange output is in seconds
  const options = [
    ['Seconds', 1],
    ['Minutes', 60],
    ['Hours', 60 * 60]
  ]
  const [multiplier, setMultiplier] = useState(1) // 'Minutes' index from options
  const onInputChange = evt => {
    let num = parseInt(evt.target.value)
    num = isNaN(num) ? 0 : num
    onChange(num * options[multiplier][1])
  }
  const onMultiplierChange = evt => {
    const newMult = evt.target.value
    setMultiplier(newMult)
    onChange(val * options[newMult][1])
  }

  useEffect(() => {
    // set default for parent
    onChange(val)
  }, []) // only occurs on initialize

  return (
    <div className='input-wrapper time-picker'>
      <label className='input-label'>{shortLabel}</label>
      <div className='input-help-label'>{label}</div>
      <input
        type='text'
        placeholder={placeholder}
        value={val ? val / options[multiplier][1] : ''}
        onChange={onInputChange}
      />
      <select onChange={onMultiplierChange} value={multiplier}>
        {options.map((o, index) => {
          return (
            <option key={`option-${index}`} value={index}>
              {o[0]}
            </option>
          )
        })}
      </select>
    </div>
  )
}
