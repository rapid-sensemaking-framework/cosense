import React from 'react'
import {
  CONTACTABLE_CONFIG_PORT_NAME
} from '../ts-built/constants'
import Register from './Register'

export default function Stage({ stage, process, sendContactableConfigs }) {
  return <>
    <h3>{stage.name}</h3>
    {/* display configured fields */}
    {stage.expectedInputs
      .filter(e => e.port !== CONTACTABLE_CONFIG_PORT_NAME)
      .map((e, index) => {
        // const key = 
        const input = process.formInputs[`${e.process}--${e.port}`]
        return <h5 key={`expectedInput-${index}`}>{e.port}: {input}</h5>
      })
    }
    {/* display registered participants, or the info to register them */}
    {stage.expectedInputs
      .filter(e => e.port === CONTACTABLE_CONFIG_PORT_NAME)
      .map((expectedInput, expectedIndex) => {
        const registerConfig = process.registerConfigs[expectedInput.process]
        const participants = process.participants[expectedInput.process]
        const { startTime } = process
        return <Register key={`register-${expectedIndex}`} {...{ registerConfig, participants, startTime, sendContactableConfigs }} />
      })}
  </>
}
