import React from 'react'

import { CONTACTABLE_CONFIG_PORT_NAME } from '../ts-built/constants'
import { mapInputToFormFieldType } from '../expected-input'
import * as forms from './forms'

export default function GraphConfigure({
  processConfig: { templateSpecific },
  template,
  updateTemplateSpecific
}) {
  return template.expectedInputs
    .filter(e => e.port !== CONTACTABLE_CONFIG_PORT_NAME)
    .map((expectedInput, index) => {
      // which component to use
      const formName = mapInputToFormFieldType(expectedInput)
      const { process, port } = expectedInput
      const C = forms[formName]
      const ident = `${process}--${port}`
      const value = templateSpecific[ident]
      return (
        <C
          key={index}
          expectedInput={expectedInput}
          value={value}
          onChange={val => updateTemplateSpecific(ident, val)}
        />
      )
    })
}
