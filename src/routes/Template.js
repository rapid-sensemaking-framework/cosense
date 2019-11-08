import React, { useState, useEffect } from 'react'
import {
  Link,
  useParams,
  useHistory
} from 'react-router-dom'
import {
  getTemplate,
  cloneTemplate,
  createProcess
} from '../ipc'
import {
  mapInputToFormFieldType
} from '../expected-input'
import * as forms from '../components/forms'

export default function Template() {
  const history = useHistory()
  const defaultTemplate = null
  const defaultFormData = {}
  const [template, setTemplate] = useState(defaultTemplate)
  const [formData, setFormData] = useState(defaultFormData)
  const { templateId } = useParams()

  useEffect(() => {
    getTemplate(templateId).then(setTemplate)
  }, [templateId])

  if (!template) {
    return <div>404 not found</div>
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const inputs = { ...formData }
    const processId = await createProcess(inputs, templateId, template)
    // redirect to the newly initiated process
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

  const clone = async () => {
    const newTemplateId = await cloneTemplate(templateId)
    // redirect to the newly cloned template
    history.push(`/template/${newTemplateId}`)
  }

  // TODO: live form validation

  return <>
    <button className="button button-clear">
      <Link to="/">Home</Link>
    </button>
    <button onClick={clone} className="button button-clear float-right">
      { template.parentTemplate ? 'Clone' : 'Clone and Edit Template' }
    </button>
    {template.parentTemplate && <>
      <button className="button button-clear float-right">
        <Link to={`/template/${templateId}/edit`}>Edit</Link>
      </button>
    </>}
    <form onSubmit={onSubmit}>
      <hr />
      <h1>Template :: {template.name}</h1>
      {template.parentTemplate && <>Parent Template: <Link to={`/template/${template.parentTemplate}`}>{ template.parentTemplate }</Link></>}
      <div dangerouslySetInnerHTML={{ __html: template.description }} />
      <p>
        As soon as you finish filling in this form and configuring participants, the rsf process will commence, meaning messages will immediately be sent to the participants.
      </p>
      {template.stages.map((stage, index) => (
        <div key={index}>
          <h2>{stage.name}</h2>
          <p>{stage.description}</p>
          {stage.expectedInputs.map((expectedInput, index) => {
            // which component to use
            const formName = mapInputToFormFieldType(expectedInput)
            const C = forms[formName]
            return <C key={index} expectedInput={expectedInput} onChange={onChange} />
          })}
          <hr />
        </div>
      ))}
      <button type="submit" onClick={onSubmit}>Move To Configure Participants</button>
    </form>
  </>
}