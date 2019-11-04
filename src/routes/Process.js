import React, { useState, useEffect } from 'react'
import {
  useParams
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
  remainingTime
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
  const { processId } = useParams()
  const defaultProcess = null
  // const defaultContactableConfigs = []
  const [process, setProcess] = useState(defaultProcess)
  const [cacheBreaker, breakCache] = useState('')
  // const [contactableConfigs, setContactableConfigs] = useState(defaultContactableConfigs)

  useEffect(() => {
    fetchProcess(processId).then(setProcess) // could be null
  }, [processId, cacheBreaker])

  console.log(process)

  if (!process) {
    return <div>404 not found (requested: {processId})</div>
  }

  const processResults = process.results ? process.results.replace(/\n/g, "<br />") : ''

  return <div>
    <h1>{ process.configuring ? 'Configure Participants' : 'Dashboard' }</h1>
    {process.running && <p>
      The process is live and running now. The results will be posted here when it's complete.
      Occasionally refresh the page to check completeness.
    </p>}
    {process.complete && <div>
      <p>The process has completed.</p>
      <p>Here are the results:</p>
      <p dangerouslySetInnerHTML={{ __html: processResults }} />
    </div>}
    {process.error && <div>
      <p>There was an error:</p>
      <p>{ process.error }</p>
    </div>}
    {process.template.stages.map((stage, stageIndex) => {
      return <div key={`stage-${stageIndex}`}>
        <h3>{ stage.name }</h3>
        {stage.expectedInputs
          .filter(e => e.port === CONTACTABLE_CONFIG_PORT_NAME)
          .map((expectedInput, expectedIndex) => {
            const registerConfig = process.registerConfigs[expectedInput.process]
            const participants = process.participants[expectedInput.process]
            const timeLeft = remainingTime(registerConfig.maxTime, process.startTime)
            // make this relate to registerConfig
            const onSubmit = (contactableConfigs) => {
              console.log(registerConfig.id, contactableConfigs)
              sendContactableConfigs(registerConfig.id, contactableConfigs)
              // this might be bug prone
              setTimeout(() => {
                breakCache(Math.random()) // so that it will refetch the process and display results
              }, 200)
            }
            const wsUrl = new URL(registerConfig.wsUrl)
            const url = `//${wsUrl.host}${URLS.REGISTER(registerConfig.id)}`
            return <div key={`register-${expectedIndex}`}>
              {!registerConfig.isFacilitator && <RegisterLink timeLeft={timeLeft} url={url} />}
              {registerConfig.isFacilitator && participants.length === 0 && <ContactablesForm onSubmit={onSubmit} />}
              {participants.length > 0 && <div>
                <p>Ready</p>
                <ol>
                  {participants.map((participant, participantIndex) => {
                    return <li key={`participant-${participantIndex}`}>
                      type: { participant.type }, id: { participant.id }
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

/*

url: `${process.env.URL}${registerConfig.path}`

*/