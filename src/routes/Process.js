import React, { useState, useEffect } from 'react'
import {
  Link,
  useParams,
  useHistory
} from 'react-router-dom'
import {
  getProcess,
  cloneProcess,
  onProcessUpdate,
  sendContactableConfigs
} from '../ipc'
import Stage from '../components/Stage'

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

  const rerun = async (event) => {
    event.preventDefault()
    const newProcessId = await cloneProcess(processId)
    // redirect to the newly initiated process
    console.log('processId', newProcessId)
    history.push(`/process/${newProcessId}`)
  }

  return <>
    <Link to="/">Home</Link>
    <hr />
    <h6>Process ID: {processId}</h6>
    <h2>{process.configuring ? 'Configure Participants' : ' Process Dashboard'}</h2>
    {process.running && <p>
      The process is live and running now.
      The results will be updated live here when it's complete.
      </p>}
    {process.complete && <p>
      The process has completed.
        <button onClick={rerun} className="button button-clear">
        Clone And Rerun This Process
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
    {process.template.stages.map((stage, stageIndex) => {
      return <Stage key={`stage-${stageIndex}`} {...{ stage, process, sendContactableConfigs }} />
    })}
  </>
}