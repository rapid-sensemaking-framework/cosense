import React from 'react'

import { CONTACTABLE_CONFIG_PORT_NAME } from '../ts-built/constants'
import {
  mapInputToFormFieldType
} from '../expected-input'
import * as forms from '../components/forms'

export default function TemplateConfigure({ template, onChange }) {
  return template.expectedInputs
    .filter((e) => e.port !== CONTACTABLE_CONFIG_PORT_NAME)
    .map((expectedInput, index) => {
    // which component to use
    const formName = mapInputToFormFieldType(expectedInput)
    const C = forms[formName]
    return <C key={index} expectedInput={expectedInput} onChange={onChange} />
  })
}