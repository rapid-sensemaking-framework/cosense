import React, { useState, useEffect } from 'react'
import {
  useParams,
  useHistory
} from 'react-router-dom'
import {
  EVENTS,
  CONTACTABLE_CONFIG_PORT_NAME,
  URLS
} from '../ts-built/constants'
import {
  getElectron
} from '../electron-require'
import {
  remainingTime,
  getRegisterAddress
} from '../ts-built/utils'
import ContactablesForm from '../components/ContactablesForm'
import RegisterLink from '../components/RegisterLink'

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
  const [cacheBreaker, breakCache] = useState('')

  useEffect(() => {
    fetchProcess(processId).then(setProcess) // could be null
  }, [processId, cacheBreaker])

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
    return <div>404 not found (requested: {processId})</div>
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

  return <div>
    <hr />
    <h6>Process ID: {processId}</h6>
    <h2>{process.configuring ? 'Configure Participants' : ' Process Dashboard'}</h2>
    {process.running && <p>
        The process is live and running now.
        The results will be updated live here when it's complete.
      </p>}
    {process.complete && <div>
      <p>
        The process has completed.
        <button onClick={rerun} className="button button-clear">
          Clone And Rerun This Process
        </button>
      </p>
    </div>}
    {process.complete && !process.error && <div>
      <h4>Results</h4>
      <p dangerouslySetInnerHTML={{ __html: processResults }} />
      <hr />
    </div>}
    {process.error && <div>
      <p>There was an error:</p>
      <p>{process.error}</p>
      <hr />
    </div>}
    {!process.configuring && <h4>Configuration</h4>}
    {process.template.stages.map((stage, stageIndex) => {
      return <div key={`stage-${stageIndex}`}>
        <h3>{stage.name}</h3>
        {stage.expectedInputs
          .filter(e => e.port !== CONTACTABLE_CONFIG_PORT_NAME)
          .map((e, index) => {
            // const key = 
            const input = process.formInputs[`${e.process}--${e.port}`]
            return <div key={`expectedInput-${index}`}>
              <h5>{e.port}: { input }</h5>
            </div>
          })
        }
        {stage.expectedInputs
          .filter(e => e.port === CONTACTABLE_CONFIG_PORT_NAME)
          .map((expectedInput, expectedIndex) => {
            const registerConfig = process.registerConfigs[expectedInput.process]
            const participants = process.participants[expectedInput.process]
            const timeLeft = remainingTime(registerConfig.maxTime, process.startTime)
            // make this relate to registerConfig
            const onSubmit = (contactableConfigs) => {
              sendContactableConfigs(registerConfig.id, contactableConfigs)
              // this might be bug prone
              setTimeout(() => {
                breakCache(Math.random()) // so that it will refetch the process and display results
              }, 200)
            }
            const hostUrl = getRegisterAddress(electron.remote.process.env, 'REGISTER_HTTP_PROTOCOL')
            const url = hostUrl + URLS.REGISTER(registerConfig.id)
            return <div key={`register-${expectedIndex}`}>
              {!registerConfig.isFacilitator && <RegisterLink timeLeft={timeLeft} url={url} />}
              {registerConfig.isFacilitator && participants.length === 0 && <ContactablesForm onSubmit={onSubmit} />}
              {participants.length > 0 && <div>
                <h5>participants</h5>
                <ol>
                  {participants.map((participant, participantIndex) => {
                    return <li key={`participant-${participantIndex}`}>
                      type: {participant.type}, id: {participant.id}
                    </li>
                  })}
                </ol>
              </div>}
            </div>
          })}
      </div>
    })}
  </div>
}