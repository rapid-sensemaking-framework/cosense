import React from 'react'
import { CONTACTABLE_CONFIG_PORT_NAME } from '../ts-built/constants'
import LabeledValue from './LabeledValue'
import RenderExpectedInputValue from './RenderExpectedInputValue'

export default function ExpectedInputs({ process }) {
  return (
    <>
      {/* display configured fields */}
      {process.template.expectedInputs
        .filter(e => e.port !== CONTACTABLE_CONFIG_PORT_NAME)
        .map(e => {
          const ident = `${e.process}--${e.port}`
          let input = process.processConfig.templateSpecific[ident]
          return (
            <LabeledValue
              key={`expectedInput-${ident}`}
              label={e.shortLabel}
              value={
                <RenderExpectedInputValue expectedInput={e} input={input} />
              }
            />
          )
        })}
    </>
  )
}
