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

export default function TemplatePreview({
  template,
  processConfig: { templateSpecific, participantsConfig, sendToAll }
}) {
  return (
    <div className='template-preview'>
      {template.expectedInputs
        .filter(e => e.port !== CONTACTABLE_CONFIG_PORT_NAME)
        .map(expectedInput => {
          const ident = `${expectedInput.process}--${expectedInput.port}`
          const input = templateSpecific[ident]
          return (
            <TemplatePreviewElement
              key={ident}
              label={expectedInput.shortLabel}>
              {input}
            </TemplatePreviewElement>
          )
        })}
      <TemplatePreviewElement
        label={`Your participants (${participantsConfig.participants.length})`}>
        <ParticipantList contactables={participantsConfig.participants} />
      </TemplatePreviewElement>
      <TemplatePreviewElement label='Send results to participants?'>
        {sendToAll ? 'Yes, send' : "No, don't send"}
      </TemplatePreviewElement>
    </div>
  )
}
