import React from 'react'

export default function TemplateSubmit() {
  return <div className="input-wrapper">
    <div className="input-label">Send results to participants?</div>
    <div className="input-help-label">
      The results will be automatically sent to your device on CoSense app.
    </div>
    <button className="button">Yes, send</button>
    <button className="button button-white">No, don't send</button>
  </div>
}