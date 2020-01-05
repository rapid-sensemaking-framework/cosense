import React from 'react'
import RenderMaxTime from './RenderMaxTime'
import RenderStatementsInput from './RenderStatementsInput'
import RenderLimit from './RenderLimit'

export default function RenderExpectedInputValue({ expectedInput, input }) {
  switch (expectedInput.port) {
    // TODO: change these to reference inputTypeOverride ?
    case 'max_responses':
      return <RenderLimit limit={input} />
    case 'max_time':
      return <RenderMaxTime seconds={input} />
    case 'statements':
      return <RenderStatementsInput statementsInput={input} />
    default:
      return input
  }
}
