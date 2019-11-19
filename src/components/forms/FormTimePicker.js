import React, { useEffect, useState } from 'react'

export default function FormTimePicker({ expectedInput, onChange }) {
  const { process, port, placeholder, defaultValue, label, shortLabel } = expectedInput
  const ident = `${process}--${port}`

  // intended onChange output is in seconds
  const options = [
    ['Seconds', 1],
    ['Minutes', 60],
    ['Hours', 60 * 60]
  ]
  const [count, setCount] = useState(0)
  const [multiplier, setMultiplier] = useState(1) // index from options
  const onInputChange = (evt) => {
    const num = parseInt(evt.target.value)
    setCount(isNaN(num) ? 0 : num)
  }
  const onMultiplierChange = (evt) => {
    setMultiplier(evt.target.value)
  }

  // update the parent any time count or multiplier changes
  useEffect(() => {
    onChange(ident, count * options[multiplier][1])
  }, [count, multiplier])

  useEffect(() => {
    // set default for parent
    onChange(ident, defaultValue)
  }, []) // only occurs on initialize

  return <div className="input-wrapper time-picker">
    <label htmlFor={ident}>{shortLabel}</label>
    <div className="input-help-label">{label}</div>
    <input type="text" id={ident} name={ident} placeholder={placeholder} defaultValue={defaultValue} onChange={onInputChange} />
    <select onChange={onMultiplierChange} value={multiplier}>
      {options.map((o, index) => {
        return <option key={`option-${index}`} value={index}>{o[0]}</option>
      })}
    </select>
  </div>
}