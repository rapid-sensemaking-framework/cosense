import React, { useState, useEffect } from 'react'
import {
  Link
} from 'react-router-dom'
import {
  getTemplates
} from '../templates'

export default function Home() {
  const defaultTemplates = []
  const [templates, setTemplates] = useState(defaultTemplates)

  useEffect(() => {
    getTemplates()
      .then(setTemplates)
      .catch(err => {
        console.log(err)
      })
  }, []) // << super important array, prevents re-fetching

  return <div>
    <h1>Design & Run Rapid Sensemaking</h1>
    {templates.map((template, index) => (
      <div key={index}>
        <Link to={template.path}>{template.name}</Link>
      </div>
    ))}
  </div>
}