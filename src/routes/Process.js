import React, { useState, useEffect } from 'react'
import {
  Link,
  useParams,
  useHistory
} from 'react-router-dom'
import {
  runProcess,
  getProcess,
  cloneProcess,
  onProcessUpdate
} from '../ipc'
import {
  CONTACTABLE_CONFIG_PORT_NAME
} from '../ts-built/constants'
import ExpectedInputs from '../components/ExpectedInputs'
import Register from '../components/Register'

export default function Process() {
  const history = useHistory()
  const { processId } = useParams()
  const defaultProcess = null
  const [process, setProcess] = useState(defaultProcess)

  // do initial fetch, on initial load
  useEffect(() => {
    getProcess(processId).then(setProcess) // could be null
  }, [processId])

  // listen for live updates
  useEffect(() => {
    const cleanup = onProcessUpdate(processId, (updatedProcess) => {
      setProcess(updatedProcess)
    })
    return () => {
      cleanup()
    }
  }, [processId])

  if (!process) {
    return <>404 not found (requested: {processId})</>
  }

  const processResults = process.results ? process.results.trim().replace(/\n/g, "<br />") : ''
  // For now, only display one
  // register config, for the whole thing
  const contactableInput = process.template.expectedInputs
    .find(e => e.port === CONTACTABLE_CONFIG_PORT_NAME)
  const ident = contactableInput.process + '--' + CONTACTABLE_CONFIG_PORT_NAME
  const registerConfig = process.registerConfigs[contactableInput.process]
  const participants = JSON.parse(process.formInputs[ident])
  const { startTime } = process

  const run = () => {
    runProcess(processId)
  }

  const rerun = async (event) => {
    event.preventDefault()
    const newProcessId = await cloneProcess(processId)
    // redirect to the newly initiated process
    console.log('processId', newProcessId)
    history.push(`/process/${newProcessId}`)
  }

  return <>
    <h6>Flow ID: {processId}</h6>
    <h2>{process.configuring ? 'Configure Participants' : ' Flow Dashboard'}</h2>
    {process.configuring && <p>
      The flow is ready to be started.
      <br />
      <br />
      <button onClick={run}>
        Run It
      </button>
    </p>}
    {process.running && <p>
      The flow is live and running now.
      The results will be updated live here when it's complete.
      </p>}
    {process.complete && <p>
      The flow has completed.
      <br />
      <br />
      <button onClick={rerun}>
        Clone And Rerun This Flow
      </button>
    </p>}
    {process.complete && !process.error && <>
      <h4>Results</h4>
      <p dangerouslySetInnerHTML={{ __html: processResults }} />
      <hr />
    </>}
    {process.error && <>
      <p>There was an error:</p>
      <p>{process.error}</p>
      <hr />
    </>}
    {!process.configuring && <h4>Configuration</h4>}
    {/* display registered participants, or the info to register them */}
    <Register {...{ registerConfig, participants, startTime }} />
    <ExpectedInputs process={process} />
  </>
}