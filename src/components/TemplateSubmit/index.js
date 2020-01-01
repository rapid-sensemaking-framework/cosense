import React from 'react'
import './TemplateSubmit.css'

export default function TemplateSubmit({ startNow, startLater }) {
  return <div className="template-submit">
    <div className="template-submit-header">
      Your flow is ready!
    </div>
    <div className="input-wrapper">
      <div className="input-label">
        Do you want to start the process now and send the prompts to the participants?
      </div>
      <div className="input-help-label">
        Prompts will be sent to participants right away and the time countdown for submitting responses will start.
      </div>
      <button className="button button-white" onClick={startLater}>
        No, I want to start later
      </button>
      <button className="button" onClick={startNow}>
        Yes, start now
      </button>
    </div>
  </div>
}