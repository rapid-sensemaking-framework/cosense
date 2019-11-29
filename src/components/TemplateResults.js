import React, { useEffect } from 'react'
import { CONTACTABLE_CONFIG_PORT_NAME } from '../ts-built/constants'

export default function TemplateSubmit({ template, formData, onChange }) {

  const expectedContactables = template.expectedInputs
    .find((e) => e.port === CONTACTABLE_CONFIG_PORT_NAME && e.process.includes("SendMessageToAll"))
  const ident = `${expectedContactables.process}--${expectedContactables.port}`
  const sendContactables = formData[ident]
  
  const mainContactablesInput = template.expectedInputs
    .find((e) => e.port === CONTACTABLE_CONFIG_PORT_NAME && !e.process.includes("SendMessageToAll"))
  const mainContactablesIdent = `${mainContactablesInput.process}--${mainContactablesInput.port}`
  const mainContactables = formData[mainContactablesIdent]

  // set defaults
  useEffect(() => {
    const defaults = mainContactables.slice(0) // clone
    onChange(ident, defaults)
  }, []) // only on mount

  const yesClassname = `button ${(!sendContactables || sendContactables.length) ? '' : 'button-white'}`
  const noClassname = `button ${(sendContactables && sendContactables.length === 0) ? '' : 'button-white'}`

  return <div className="input-wrapper">
    <div className="input-label">Send results to participants?</div>
    <div className="input-help-label">
      The results will be automatically sent to your device on CoSense app.
    </div>
    <button className={yesClassname} onClick={() => onChange(ident, mainContactables)}>Yes, send</button>
    <button className={noClassname} onClick={() => onChange(ident, [])}>No, don't send</button>
  </div>
}