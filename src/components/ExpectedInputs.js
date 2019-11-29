import React from 'react'
import {
  CONTACTABLE_CONFIG_PORT_NAME
} from '../ts-built/constants'
import LabeledValue from './LabeledValue'
import moment from 'moment'

export default function ExpectedInputs({ process }) {
  return <>
    {/* display configured fields */}
    {process.template.expectedInputs
      .filter(e => e.port !== CONTACTABLE_CONFIG_PORT_NAME)
      .map((e) => {
        const ident = `${e.process}--${e.port}`
        let input = process.formInputs[ident]
        if (e.port === 'max_time') {
          input = moment.duration(input, 'seconds').humanize()
        } else if (e.port === 'statements') {
          input = <p style={{whiteSpace: 'pre-wrap'}}>{input}</p>
        }
        return <LabeledValue key={`expectedInput-${ident}`} label={e.shortLabel} value={input} />
      })
    }
  </>
}
