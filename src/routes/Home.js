import React, { useState, useEffect } from 'react'
import {
  Link
} from 'react-router-dom'
import {
  getSystemTemplates,
  getUserTemplates,
  getProcesses
} from '../ipc'
import './Home.css'
import {
  URLS
} from '../ts-built/constants'

export default function Home() {
  const defaultTemplates = []
  const defaultProcesses = []
  const [systemTemplates, setSystemTemplates] = useState(defaultTemplates)
  const [userTemplates, setUserTemplates] = useState(defaultTemplates)
  const [processes, setProcesses] = useState(defaultProcesses)

  useEffect(() => {
    getSystemTemplates()
      .then(setSystemTemplates)
      .catch(err => {
        console.log(err)
      })
    getUserTemplates()
      .then(setUserTemplates)
      .catch(err => {
        console.log(err)
      })
    getProcesses()
      .then(setProcesses)
      .catch(err => {
        console.log(err)
      })
  }, []) // << super important array, prevents re-fetching

  return <>
    <h1>CoSense</h1>
    <h2>Be a collective intelligence designer</h2>
    <div className="templates-container">
      {systemTemplates.map((template, templateIndex) => {
        return <Link className="home-template-link" to={template.path} key={`template-${templateIndex}`}>
          <div className="home-template-image" />
          <div className="home-template-name">{template.name}</div>
          <div className="home-template-one-liner">{template.oneLiner}</div>
        </Link>
      })}
    </div>
    <div className="divider" />
    <div className="processes-container">
      {processes.map((process, processIndex) => {
        return <Link className="home-template-link" to={URLS.PROCESS.replace(':processId', process.id)} key={`process-${processIndex}`}>
          <div className="home-template-image" />
          <div className="home-template-name">{process.id}</div>
        </Link>
      })}
    </div>
  </>
}