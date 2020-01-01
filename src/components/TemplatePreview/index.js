import React from 'react'
import './TemplatePreview.css'
import { CONTACTABLE_CONFIG_PORT_NAME } from '../../ts-built/constants'
import ParticipantList from '../ParticipantList'

function TemplatePreviewElement({ label, children }) {
  return (
    <div className='template-preview-element'>
      <div className='template-preview-label'>{label}</div>
      <div className='template-preview-value'>{children}</div>
    </div>
  )
}

export default function TemplatePreview({ template, formData }) {
  const mainInput = template.expectedInputs.find(
    e =>
      e.port === CONTACTABLE_CONFIG_PORT_NAME &&
      !e.process.includes('SendMessageToAll')
  )
  const mainIdent = `${mainInput.process}--${mainInput.port}`
  const mainContactables = formData[mainIdent]
  const sendMessageInput = template.expectedInputs.find(
    e =>
      e.port === CONTACTABLE_CONFIG_PORT_NAME &&
      e.process.includes('SendMessageToAll')
  )
  const sendMessageIdent = `${sendMessageInput.process}--${sendMessageInput.port}`
  const sendMessageContactables = formData[sendMessageIdent]
  const nonContactablesInputs = template.expectedInputs.filter(
    e => e.port !== CONTACTABLE_CONFIG_PORT_NAME
  )

  return (
    <div className='template-preview'>
      {nonContactablesInputs.map(expectedInput => {
        const ident = `${expectedInput.process}--${expectedInput.port}`
        const input = formData[ident]
        return (
          <TemplatePreviewElement key={ident} label={expectedInput.shortLabel}>
            {input}
          </TemplatePreviewElement>
        )
      })}
      <TemplatePreviewElement
        label={`Your participants (${mainContactables.length})`}>
        <ParticipantList contactables={mainContactables} />
      </TemplatePreviewElement>
      <TemplatePreviewElement label='Send results to participants?'>
        {sendMessageContactables.length ? 'Yes, send' : "No, don't send"}
      </TemplatePreviewElement>
    </div>
  )
}
