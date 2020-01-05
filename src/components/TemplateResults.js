import React from 'react'

export default function TemplateSubmit({
  processConfig: { sendToAll },
  updateSendToAll
}) {
  const yesClassname = `button ${sendToAll ? '' : 'button-white'}`
  const noClassname = `button ${!sendToAll ? '' : 'button-white'}`

  return (
    <div className='input-wrapper'>
      <div className='input-label'>Send results to participants?</div>
      <div className='input-help-label'>
        The results will be automatically sent to your device on CoSense app.
      </div>
      <button className={yesClassname} onClick={() => updateSendToAll(true)}>
        Yes, send
      </button>
      <button className={noClassname} onClick={() => updateSendToAll(false)}>
        No, don't send
      </button>
    </div>
  )
}
