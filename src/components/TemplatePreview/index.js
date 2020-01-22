import React from 'react'
import './TemplatePreview.css'
import { CONTACTABLE_CONFIG_PORT_NAME } from '../../ts-built/constants'
import ParticipantList from '../ParticipantList'
import { FROM_PUBLIC_LINK } from '../../ts-built/process-config'
import RenderMaxTime from '../RenderMaxTime'
import RenderLimit from '../RenderLimit'
import RenderExpectedInputValue from '../RenderExpectedInputValue'

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
  processConfig: { name, templateSpecific, participantsConfig, sendToAll }
}) {
  const { method, publicLink } = participantsConfig
  return (
    <div className='template-preview'>
      {/* Step 1 */}
      <TemplatePreviewElement label={'Flow Name'}>
        {name}
      </TemplatePreviewElement>
      {template.expectedInputs
        .filter(e => e.port !== CONTACTABLE_CONFIG_PORT_NAME)
        .map(expectedInput => {
          const ident = `${expectedInput.process}--${expectedInput.port}`
          const input = templateSpecific[ident]
          return (
            <TemplatePreviewElement
              key={ident}
              label={expectedInput.shortLabel}>
              <RenderExpectedInputValue
                expectedInput={expectedInput}
                input={input}
              />
            </TemplatePreviewElement>
          )
        })}
      {/* Step 2 */}
      {method === FROM_PUBLIC_LINK && (
        <>
          <TemplatePreviewElement label={'Public Link Description'}>
            {publicLink.description}
          </TemplatePreviewElement>
          <TemplatePreviewElement label={'Public Link Time Limit'}>
            <RenderMaxTime seconds={publicLink.maxTime} />
          </TemplatePreviewElement>
          <TemplatePreviewElement label={'Public Link Participant Limit'}>
            <RenderLimit limit={publicLink.maxParticipants} />
          </TemplatePreviewElement>
        </>
      )}
      {/* TODO: FROM_EXISTING_LIST */}
      {method !== FROM_PUBLIC_LINK && (
        <TemplatePreviewElement
          label={`Your participants (${participantsConfig.participants.length})`}>
          <ParticipantList contactables={participantsConfig.participants} />
        </TemplatePreviewElement>
      )}
      {/* Step 3 */}
      <TemplatePreviewElement label='Send results to participants?'>
        {sendToAll ? 'Yes, send' : "No, don't send"}
      </TemplatePreviewElement>
    </div>
  )
}
