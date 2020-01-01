import React from 'react'
import './LabeledValue.css'

export default function LabeledValue({ label, value }) {
  return <div className="labeled-value">
    <div className="labeled-value-circle" />
    <div className="labeled-value-label-value">
      <div className="labeled-value-label">{label}</div>
      <div className="labeled-value-value">{value}</div>
    </div>
  </div>
}