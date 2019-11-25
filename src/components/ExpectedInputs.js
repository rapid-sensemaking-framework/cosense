import React from 'react'
import {
  CONTACTABLE_CONFIG_PORT_NAME
} from '../ts-built/constants'

export default function ExpectedInputs({ process }) {
  return <>
    {/* display configured fields */}
    {process.template.expectedInputs
      .filter(e => e.port !== CONTACTABLE_CONFIG_PORT_NAME)
      .map((e, index) => {
        // const key = 
        const input = process.formInputs[`${e.process}--${e.port}`]
        return <h5 key={`expectedInput-${index}`}>{e.port}: {input}</h5>
      })
    }
  </>
}
