import React, { useState, useEffect } from 'react'
import {
  Link
} from 'react-router-dom'
import {
  getTemplates,
  getProcesses
} from '../ipc'

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
    <hr />
    <h1>Design & Run <br /> Rapid Sensemaking</h1>
    <p>
      "Rapid sensemaking" in the context of the "rapid sensemaking framework" (rsf) means using digital tools
      to quickly and easily reach many people across many mediums, from Telegram to text messaging and far
      further, and to engage them in processes of ideation, decision making, voting, or other social
      thinking/acting. You can read more about it <a target="_blank" href="https://github.com/rapid-sensemaking-framework/noflo-rsf">here</a>.
      The following are available templates for running rapid sensemaking.
    </p>
    {templates.map((template, templateIndex) => {
      const matchedProcesses = processes.filter(x => x.templateId === template.id)
      return <div key={`template-${templateIndex}`}>
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
}