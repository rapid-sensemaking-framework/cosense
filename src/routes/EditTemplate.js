import React, { useState, useEffect } from 'react'
import {
  Link,
  useParams,
  useHistory
} from 'react-router-dom'
import {
  getTemplate,
  updateTemplate
} from '../ipc'
import {
  CONTACTABLE_CONFIG_PORT_NAME
} from '../ts-built/constants'
import {
  mapInputToFormFieldType
} from '../expected-input'
import * as forms from '../components/forms'

export default function Template() {
  const history = useHistory()
  const defaultTemplate = null
  const defaultFormData = {}
  const defaultName = ''
  const defaultDescription = ''
  const [loading, setLoading] = useState(true)
  const [template, setTemplate] = useState(defaultTemplate)
  const [name, setName] = useState(defaultName)
  const [description, setDescription] = useState(defaultDescription)
  const [formData, setFormData] = useState(defaultFormData)
  const { templateId } = useParams()

  useEffect(() => {
    getTemplate(templateId).then((template) => {
      setTemplate(template)
      if (template) {
        setName(template.name)
        setDescription(template.description)
      }
      setLoading(false)
    })
  }, [templateId])

  if (loading) {
    return <>Loading...</>
  }

  if (!template) {
    return <div>404 not found</div>
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    await updateTemplate({
      name,
      description,
      expectedInputs: { ...formData },
      templateId
    })
    // redirect to the newly saved template
    history.push(`/template/${templateId}`)
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

  return <>
    <Link to="/">Home</Link>
    <form onSubmit={onSubmit}>
      <hr />
      <h1>Edit Template</h1>
      <label htmlFor="template-name">Name</label>
      <input name="template-name" type="text" value={name} onChange={e => setName(e.target.value)} />
      <label htmlFor="template-description">Description</label>
      <textarea name="template-description" value={description} onChange={e => setDescription(e.target.value)} />
      {template.stages.map((stage, index) => {
        return <div key={index}>
          <h2>{stage.name}</h2>
          <p>{stage.description}</p>
          {/* exclude contactable_config inputs */}
          {stage.expectedInputs
            .filter(e => e.port !== CONTACTABLE_CONFIG_PORT_NAME)
            .map((expectedInput, index) => {
              // which component to use
              const formName = mapInputToFormFieldType(expectedInput)
              const C = forms[formName]
              return <C key={index} expectedInput={expectedInput} onChange={onChange} />
            })}
          <hr />
        </div>
      })}
      <button type="submit" onClick={onSubmit}>save changes</button>
    </form>
  </>
}