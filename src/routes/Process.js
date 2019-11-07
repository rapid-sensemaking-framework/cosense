import React, { useState, useEffect } from 'react'
import {
  useParams,
  useHistory
} from 'react-router-dom'
import {
  EVENTS,
} from '../ts-built/constants'
import {
  getElectron
} from '../electron-require'
import Stage from '../components/Stage'

const electron = getElectron()
const ipc = electron.ipcRenderer

async function fetchProcess(processId) {
  ipc.send(EVENTS.IPC.GET_PROCESS, processId)
  return await new Promise((resolve) => {
    ipc.once(EVENTS.IPC.RETURN_PROCESS, (event, process) => resolve(process))
  })
}

function sendContactableConfigs(id, contactableConfigs) {
  return ipc.send(EVENTS.IPC.HANDLE_FACIL_CONTACTABLES_SUBMIT(id), contactableConfigs)
}

export default function Process() {
  const history = useHistory()
  const { processId } = useParams()
  const defaultProcess = null
  const [process, setProcess] = useState(defaultProcess)

  // do initial fetch, on initial load
  useEffect(() => {
    fetchProcess(processId).then(setProcess) // could be null
  }, [processId])

  // listen for live updates
  useEffect(() => {
    const channelId = EVENTS.IPC.PROCESS_UPDATE(processId)
    ipc.on(channelId, (event, updatedProcess) => {
      setProcess(updatedProcess)
    })
    // cleanup
    return () => {
      ipc.removeAllListeners(channelId)
    }
  }, [processId])

  if (!process) {
    return <>404 not found (requested: {processId})</>
  }

  const processResults = process.results ? process.results.trim().replace(/\n/g, "<br />") : ''

  const rerun = async (event) => {
    event.preventDefault()
    ipc.send(EVENTS.IPC.CLONE_PROCESS, processId)
    const newProcessId = await new Promise((resolve) => {
      ipc.once(EVENTS.IPC.PROCESS_CLONED, (event, newProcessId) => resolve(newProcessId))
    })
    // redirect to the newly initiated process
    console.log('processId', newProcessId)
    history.push(`/process/${newProcessId}`)
  }

  return <>
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