import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSystemTemplates, getUserTemplates } from '../../ipc'
import './Home.css'

export default function Home() {
  const defaultTemplates = []
  const defaultProcesses = []
  const [systemTemplates, setSystemTemplates] = useState(defaultTemplates)
  const [userTemplates, setUserTemplates] = useState(defaultTemplates)

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
  }, []) // << super important array, prevents re-fetching

  return (
    <>
      <h1>CoSense</h1>
      <h2>collective intelligence design</h2>
      <div className='templates-container'>
        {systemTemplates.map((template, templateIndex) => {
          return (
            <Link
              className='home-template-link'
              to={template.path}
              key={`template-${templateIndex}`}>
              <div className='home-template-image' />
              <div className='home-template-name'>{template.name}</div>
              <div className='home-template-one-liner'>{template.oneLiner}</div>
            </Link>
          )
        })}
      </div>
      <div className='divider' />
    </>
  )
}
