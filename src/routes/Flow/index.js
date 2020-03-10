import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { useParams, useHistory } from 'react-router-dom'
import {
  runProcess,
  getProcess,
  cloneProcess,
  onProcessUpdate
} from '../../ipc'
import ExpectedInputs from '../../components/ExpectedInputs'
import LabeledValue from '../../components/LabeledValue'
import ParticipantList from '../../components/ParticipantList'
import ParticipantRegister from '../../components/ParticipantRegister'
import './Flow.css'
import { USER_PROCESSES_PATH } from '../../ts-built/folders'
import { FROM_PUBLIC_LINK } from '../../ts-built/process-config'
import { getElectron } from '../../electron-require'
const { shell } = getElectron()

const formatByResultType = (r, type) => {
  switch (type) {
    case 'Statement':
      return r.text
    case 'Reaction':
      return (
        <>
          Statement: {r.statement.text}
          <br />
          Reaction type: {r.response}
          <br />
          Reaction text: {r.responseTrigger}
        </>
      )
    case 'PairwiseVote':
      return (
        <>
          0) {r.choices[0].text}
          <br />
          1) {r.choices[1].text}
          <br />
          choice: {r.choice}
        </>
      )
    case 'PairwiseQuantified':
      return (
        <>
          0) {r.choices[0].text}
          <br />
          1) {r.choices[1].text}
          <br />
          response: {r.quantity}
        </>
      )
    case 'PairwiseQualified':
      return (
        <>
          0) {r.choices[0].text}
          <br />
          1) {r.choices[1].text}
          <br />
          response: {r.quality}
        </>
      )
    default:
      return (
        <>
          no template for result type: {type}
          raw: {JSON.stringify(r, null, 2)}
        </>
      )
  }
}

export default function Process() {
  const history = useHistory()
  const { processId } = useParams()
  const defaultProcess = null
  const [process, setProcess] = useState(defaultProcess)
  const [loading, setLoading] = useState(true)
  const [showContactables, setShowContactables] = useState(false)

  // do initial fetch, on initial load
  useEffect(() => {
    setLoading(true)
    getProcess(processId)
      .then(setProcess) // could be null
      .then(() => setLoading(false))
  }, [processId])

  // listen for live updates
  useEffect(() => {
    const cleanup = onProcessUpdate(processId, updatedProcess => {
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

  const { participantsConfig } = process.processConfig
  const { method, participants, publicLink } = participantsConfig
  const reachedParticipantLimit =
    participants.length === publicLink.maxParticipants

  const run = () => {
    runProcess(processId)
  }

  const clone = async event => {
    event.preventDefault()
    const newProcessId = await cloneProcess(processId)
    // redirect to the newly initiated process
    history.push(`/process/${newProcessId}`)
  }

  const createdTimeString = moment(process.createdTime).calendar()
  const startTimeString =
    process.startTime && moment(process.startTime).calendar()
  const endTimeString = process.endTime && moment(process.endTime).calendar()

  const sortByTimestamps = (r1, r2) => (r1.timestamp < r2.timestamp ? 1 : -1)

  const openFlowFile = e => {
    e.preventDefault()
    shell.openItem(USER_PROCESSES_PATH + `/${processId}.json`)
  }

  return (
    <div className="flow">
      <div className="flow-intro">
        <div className="flow-name">{process.name}</div>
        {process.running && <div className="flow-live">Live</div>}
        <div className="flow-date">
          {process.configuring ? (
            <>Created {createdTimeString}</>
          ) : (
            <>
              Started {startTimeString}
              {process.complete ? `, Ended ${endTimeString}` : ''}
            </>
          )}
        </div>
      </div>
      <div className="flow-template">{process.template.name}</div>
      {process.complete && (
        <button className="button" onClick={clone}>
          Clone This Flow
        </button>
      )}
      {process.configuring && (
        <p>
          The flow is ready to be started.
          <br />
          <br />
          <button className="button" onClick={run}>
            Run It
          </button>
        </p>
      )}
      {method === FROM_PUBLIC_LINK && (
        <div className="participant-register-wrapper">
          <ParticipantRegister
            reachedParticipantLimit={reachedParticipantLimit}
            participantRegisterConfig={publicLink}
            startTime={process.startTime}
          />
        </div>
      )}
      <LabeledValue label={'Participants'} value={participants.length} />
      <button
        className="button"
        onClick={() => setShowContactables(!showContactables)}
      >
        {showContactables ? 'Hide List' : 'See List'}
      </button>
      {showContactables && <ParticipantList contactables={participants} />}
      <LabeledValue
        label={'Responses'}
        value={process.results ? process.results.length : 0}
      />
      <ExpectedInputs process={process} />
      <div className="flow-label flow-responses-feed-label">Responses Feed</div>
      {/* Download (placeholder) */}
      <div className="flow-responses-feed">
        {process.results &&
          process.results.sort(sortByTimestamps).map(result => {
            return (
              <div className="flow-responses-feed-item">
                <div className="flow-responses-feed-item-value">
                  {formatByResultType(result, process.template.resultType)}
                </div>
                <div className="flow-responses-feed-item-meta">
                  {result.contact && (
                    <div className="flow-responses-feed-item-actor">
                      {result.contact.id}
                    </div>
                  )}
                  <div className="flow-responses-feed-item-time">
                    {moment(result.timestamp).calendar()}
                  </div>
                </div>
              </div>
            )
          })}
      </div>
      {process.error && (
        <>
          <p>There was an error:</p>
          <p>
            {typeof process.error === 'object'
              ? JSON.stringify(process.error)
              : process.error}
          </p>
        </>
      )}
      <div className="divider" />
      <a href="#" onClick={openFlowFile}>
        Show Data File
      </a>
    </div>
  )
}
