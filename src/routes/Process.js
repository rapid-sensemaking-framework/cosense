import React, { useState, useEffect } from 'react'
import moment from 'moment'
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
  const [loading, setLoading] = useState(true)

  // do initial fetch, on initial load
  useEffect(() => {
    setLoading(true)
    getProcess(processId)
      .then(setProcess) // could be null
      .then(() => setLoading(false))
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

  if (loading) {
    return <>Loading...</>
  }

  if (!process) {
    return <>404 not found (requested: {processId})</>
  }

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

  const clone = async (event) => {
    event.preventDefault()
    const newProcessId = await cloneProcess(processId)
    // redirect to the newly initiated process
    history.push(`/process/${newProcessId}`)
  }

  const dateString = moment(process.startTime).fromNow()

  return <>
    <h2>{process.configuring ? 'Configure Participants' : ' Flow Dashboard'}</h2>
    {process.startTime && <p>
      Started: {dateString}
    </p>}
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
      The results will be updated live here.
      </p>}
    {process.complete && <p>
      The flow has completed.
      <br />
      <br />
      <button onClick={clone}>
        Clone This Flow
      </button>
    </p>}
    {process.results && <>
      <h4>Results</h4>
      {process.results.map((result) => {
        const clone = { ...result }
        const timestamp = clone.timestamp
        const contact = clone.contact
        delete clone.timestamp
        delete clone.contact
        return <>
          {JSON.stringify(clone, null, 2)}<br />
          {moment(timestamp).calendar()}<br />
          {contact.id}
          <br />
          <br />
        </>
      })}
      <hr />
    </>}
    {process.error && <>
      <p>There was an error:</p>
      <p>{typeof process.error === 'object' ? JSON.stringify(process.error) : process.error}</p>
      <hr />
    </>}
    {!process.configuring && <h4>Configuration</h4>}
    {/* display registered participants, or the info to register them */}
    <Register {...{ registerConfig, participants, startTime }} />
    <ExpectedInputs process={process} />
  </>
}