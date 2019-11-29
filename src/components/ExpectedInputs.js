import React from 'react'
import {
  CONTACTABLE_CONFIG_PORT_NAME
} from '../ts-built/constants'
import LabeledValue from './LabeledValue'

export default function ExpectedInputs({ process }) {
  return <>
    {/* display configured fields */}
    {process.template.expectedInputs
      .filter(e => e.port !== CONTACTABLE_CONFIG_PORT_NAME)
      .map((e) => {
        const ident = `${e.process}--${e.port}`
        const input = process.formInputs[ident]
        return <LabeledValue key={`expectedInput-${ident}`} label={e.shortLabel} value={input} />
      })
    }
  </>
}
