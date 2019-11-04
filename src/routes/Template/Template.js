import React, { useState, useEffect } from 'react'
import {
  useParams,
  useHistory
} from 'react-router-dom'
import {
  getTemplate
} from '../../templates'
import {
  getGraph
} from '../../graphs'
import {
  EVENTS
} from '../../ts-built/constants'
import {
  componentMetaForStages
} from '../../ts-built/utils'
import {
  getElectron
} from '../../electron-require'

const electron = getElectron()
const ipc = electron.ipcRenderer
const runtimeAddress = electron.remote.process.env.ADDRESS
const runtimeSecret = electron.remote.process.env.TOP_SECRET

async function fetchTemplate(templateId) {
  const t = await getTemplate(templateId)
  if (t) {
    const graph = await getGraph(templateId) // templateId matches graphId
    const stages = await componentMetaForStages(t.stages, graph, runtimeAddress, runtimeSecret)
    return {
      ...t,
      stages // override stages with new metadata
    }
  } else {
    return null
  }
}

// noflo input types
// all, string, number, int, object, array, boolean, color, date, bang, function, buffer, stream
// map these to form inputs
// allow for overrides
const nofloTypeMap = {
  string: 'text',
  number: 'text',
  int: 'text',
  boolean: 'checkbox',
  array: 'text',
  object: 'text',
  all: 'text'
  // TODO: the rest
}
const specialPorts = {
  contactable_configs: 'register_config',
  statements: 'textarea'
}
// TODO: create a default?
const mapInputToFormType = (expectedInput) => {
  const { type, port, inputTypeOverride } = expectedInput
  // specialPorts > inputTypeOverride > basic type
  const form_partial = specialPorts[port] || inputTypeOverride || nofloTypeMap[type]
  return `form_${form_partial}`
}

export default function Template() {
  const history = useHistory()
  const defaultTemplate = null
  const defaultFormData = {}
  const [template, setTemplate] = useState(defaultTemplate)
  const [formData, setFormData] = useState(defaultFormData)
  const { templateId } = useParams()

  useEffect(() => {
    fetchTemplate(templateId).then(setTemplate)
  }, [templateId])

  if (!template) {
    return <div>404 not found</div>
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const inputs = { ...formData }
    const template = await getTemplate(templateId)
    const graph = await getGraph(templateId)
    ipc.send(EVENTS.IPC.HANDLE_TEMPLATE_SUBMIT, { inputs, templateId, template, graph })
    const processId = await new Promise((resolve) => {
      ipc.once(EVENTS.IPC.TEMPLATE_SUBMIT_HANDLED, (event, processId) => resolve(processId))
    })
    // redirect to the newly initiated process
    console.log('processId', processId)
    history.push(`/process/${processId}`)
  }

  const onChange = (key, value) => {
    console.log('setting:', key, value)
    // if state depends on previous state,
    // you have to be sure to use callback style
    // of state update functions
    setFormData(formData => ({
      ...formData,
      [key]: value
    }))
  }

  // TODO: live form validation

  return <form onSubmit={onSubmit}>
    <div id="notifier"></div>
    <h1>Design & Run Rapid Sensemaking</h1>
    <h2>{template.name}</h2>
    <div>
      <p>
        "Rapid sensemaking" in the context of the "rapid sensemaking framework" (rsf) means using digital tools
        to quickly and easily reach many people across many mediums, from Telegram to text messaging and far
        further, and to engage them in processes of ideation, decision making, voting, or other social
        thinking/acting.
      </p>
      <p>
        You can read more about it here: <a target="_blank" href="https://github.com/rapid-sensemaking-framework/noflo-rsf">https://github.com/rapid-sensemaking-framework/noflo-rsf</a>
      </p>
      <div dangerouslySetInnerHTML={{ __html: template.description }} />
      <p>
        As soon as you finish filling in this form and configuring participants, the rsf process will commence, meaning messages will immediately be sent to the participants.
      </p>
    </div>
    {template.stages.map((stage, index) => (
      <div key={index}>
        <h2>{stage.name}</h2>
        <p>{stage.description}</p>
        {stage.expectedInputs.map((expectedInput, index) => {
          const formCompPath = `./forms/${mapInputToFormType(expectedInput)}`
          const C = require(formCompPath).default
          return <C key={index} expectedInput={expectedInput} onChange={onChange} />
        })}
        <hr />
      </div>
    ))}
    <br />
    <button type="submit">Move To Configure Participants</button>
  </form>
}