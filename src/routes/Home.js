import React, { useState, useEffect } from 'react'
import {
  Link
} from 'react-router-dom'
import {
  getTemplates
} from '../templates'
import {
  EVENTS
} from '../ts-built/constants'
import {
  getElectron
} from '../electron-require'
const electron = getElectron()
const ipc = electron.ipcRenderer

const getProcesses = async () => {
  ipc.send(EVENTS.IPC.GET_PROCESSES)
  return await new Promise((resolve) => {
    ipc.once(EVENTS.IPC.RETURN_PROCESSES, (event, processes) => resolve(processes))
  })
}

export default function Home() {
  const defaultTemplates = []
  const defaultProcesses = []
  const [templates, setTemplates] = useState(defaultTemplates)
  const [processes, setProcesses] = useState(defaultProcesses)

  useEffect(() => {
    getTemplates()
      .then(setTemplates)
      .catch(err => {
        console.log(err)
      })
    getProcesses()
      .then(setProcesses)
      .catch(err => {
        console.log(err)
      })
  }, []) // << super important array, prevents re-fetching

  return <div>
    <h1>Design & Run Rapid Sensemaking</h1>
    <div className="container">
      <div className="row">
        {templates.map((template, templateIndex) => {
          const matchedProcesses = processes.filter(x => x.templateId === template.id)
          return <div className="column" key={`template-${templateIndex}`}>
            <Link to={template.path}><h4>{template.name}</h4></Link>
            {matchedProcesses.length > 0 && <div>
              Processes<br />
              {matchedProcesses.map((mp, mpIndex) => {
                return <div>
                  <Link key={`mp-${mpIndex}`} to={`/process/${mp.id}`}>
                    {mp.id.slice(0, 10)}...
                    {mp.complete && `✓`}
                    {mp.error && `❌`}
                  </Link>
                  <br />
                </div>
              })}
            </div>}
          </div>
        })}
      </div>
    </div>
  </div>
}