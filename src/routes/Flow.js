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
import './Flow.css'

const formatByResultType = (r, type) => {
  switch (type) {
    case 'Statement':
      return r.text
    case 'Reaction':
      return <>
        Statement: {r.statement.text}<br />
        Reaction type: {r.response}<br />
        Reaction text: {r.responseTrigger}
      </>
    case 'PairwiseVote':
      return <>
        0) {r.choices[0].text}<br />
        1) {r.choices[1].text}<br />
        choice: {r.choice}
      </>
    case 'PairwiseQuantified':
      return <>
        0) {r.choices[0].text}<br />
        1) {r.choices[1].text}<br />
        response: {r.quantity}
      </>
    case 'PairwiseQualified':
      return <>
        0) {r.choices[0].text}<br />
        1) {r.choices[1].text}<br />
        response: {r.quality}
      </>
    default:
      return <>
        no template for result type: {type}
        raw: {JSON.stringify(r, null, 2)}
      </>
  }
}

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

  const run = () => {
    runProcess(processId)
  }

  const clone = async (event) => {
    event.preventDefault()
    const newProcessId = await cloneProcess(processId)
    // redirect to the newly initiated process
    history.push(`/process/${newProcessId}`)
  }

  const createdTimeString = moment(process.createdTime).calendar()
  const startTimeString = process.startTime && moment(process.startTime).calendar()
  const endTimeString = process.endTime && moment(process.endTime).calendar()

  const sortByTimestamps = (r1, r2) => r1.timestamp < r2.timestamp ? 1 : -1

  return <>
    <div className="flow-intro">
      <div className="flow-name">
        My Template1
      </div>
      {process.running && <div className="flow-live">Live</div>}
      <div className="flow-date">
        {process.configuring
          ? <>
            Created {createdTimeString}
          </>
          : <>
            Started {startTimeString}
            {process.complete ? `, Ended ${endTimeString}` : ''}
          </>}
      </div>
    </div>
    <div className="flow-template">
      {process.template.name}
    </div>
    <div className="flow-label">
      Participants
      </div>
    <div className="flow-config-value">
      {participants.length}
    </div>
    <div className="flow-label">
      Responses
    </div>
    <div className="flow-config-value">
      {process.results ? process.results.length : 0}
    </div>
    {process.configuring && <p>
      The flow is ready to be started.
      <br />
      <br />
      <button onClick={run}>
        Run It
      </button>
    </p>}
    {/* {process.complete && <button onClick={clone}>
      Clone This Flow
    </button>} */}
    {/* <ExpectedInputs process={process} /> */}
    {/* display registered participants, or the info to register them */}
    {/* <Register {...{ registerConfig, participants, startTime }} /> */}
    <div className="flow-label flow-responses-feed-label">Responses Feed</div>
    {/* Download (placeholder) */}
    <div className="flow-responses-feed">
      {process.results && process.results.sort(sortByTimestamps).map((result) => {
        return <div className="flow-responses-feed-item">
          <div className="flow-responses-feed-item-value">
            {formatByResultType(result, process.template.resultType)}
          </div>
          <div className="flow-responses-feed-item-meta">
            <div className="flow-responses-feed-item-actor">
              {result.contact.id}
            </div>
            <div className="flow-responses-feed-item-time">
              {moment(result.timestamp).calendar()}
            </div>
          </div>
        </div>
      })}
    </div>
    {process.error && <>
      <p>There was an error:</p>
      <p>{typeof process.error === 'object' ? JSON.stringify(process.error) : process.error}</p>
    </>}
  </>
}