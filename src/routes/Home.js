import React, { useState, useEffect } from 'react'
import {
  Link
} from 'react-router-dom'
import {
  getTemplates,
  getProcesses
} from '../ipc'
import './Home.css'

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

  return <>
    <h1>CoSense</h1>
    <h2>Be a collective intelligence designer</h2>
    <div className="template-container">
      {templates.map((template, templateIndex) => {
        return <Link className="home-template-link" to={template.path} key={`template-${templateIndex}`}>
          <div className="home-template-image" />
          <div className="home-template-name">{template.name}</div>
          <div className="home-template-one-liner">{template.oneLiner}</div>
        </Link>
      })}
    </div>
  </>
}