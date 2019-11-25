import React from 'react'

export default function TemplateSubmit() {
  return <div className="input-wrapper">
    <div className="input-label">Send results to participants?</div>
    <div className="input-help-label">
      The results will be automatically sent to your device on CoSense app.
    </div>
    <button>Yes, send</button>
    <button className="button-inactive">No, don't send</button>
  </div>
}