import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import {
  getTemplate,
  cloneTemplate,
  createProcess,
  runProcess
} from '../../ipc'

import GraphConfigure from '../../components/GraphConfigure'
import TemplateContactables from '../../components/TemplateContactables'
import TemplateResults from '../../components/TemplateResults'
import TemplatePreview from '../../components/TemplatePreview'
import TemplateSubmit from '../../components/TemplateSubmit'
import './Template.css'

export default function Template() {
  const history = useHistory()
  const defaultTemplate = null
  const defaultFormData = {}
  const defaultActiveStep = 1
  const [activeStep, setActiveStep] = useState(defaultActiveStep)
  const [loading, setLoading] = useState(true)
  const [template, setTemplate] = useState(defaultTemplate)
  const [formData, setFormData] = useState(defaultFormData)
  const [processId, setProcessId] = useState(null)
  const { templateId } = useParams()

  useEffect(() => {
    getTemplate(templateId).then(template => {
      setTemplate(template)
      setLoading(false)
    })
  }, [templateId])

  if (loading) {
    return <>Loading...</>
  }

  if (!template) {
    return <>404 not found</>
  }

  const submit = async () => {
    const inputs = { ...formData }
    const pId = await createProcess(inputs, templateId, template)
    setProcessId(pId)
    setActiveStep(5)
  }
  const startNow = async () => {
    await runProcess(processId)
    // redirect to the newly initiated process
    history.push(`/process/${processId}`)
  }
  const startLater = async () => {
    history.push(`/process`)
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

  const steps = [
    ['Prompt', GraphConfigure],
    ['Participants', TemplateContactables],
    ['Results', TemplateResults],
    ['Preview', TemplatePreview],
    ['Submit', TemplateSubmit]
  ]

  // activeStep is 1 indexed, not 0 indexed
  const WhichStep = steps[activeStep - 1][1]

  return (
    <div className='template'>
      {/* <button onClick={clone} className="button button-clear float-right">
      {template.parentTemplate ? 'Clone' : 'Clone and Edit Template'}
    </button> */}
      {/* {template.parentTemplate && <>
      <button className="button button-clear float-right">
        <Link to={`/template/${templateId}/edit`}>Edit</Link>
      </button>
    </>} */}
      <div className='template-labels'>
        <h1>{template.name}</h1>
        <h2>{template.oneLiner}</h2>
      </div>
      <div className='template-steps'>
        {steps.map((step, index) => {
          return (
            <div key={`step-${index}`}>
              {index > 0 && <div className='step-spacer' />}
              <div
                className={`step-indicator ${
                  index + 1 === activeStep ? 'active' : ''
                }`}>
                <div className='step-circle'>{index + 1}</div>
                {step[0]}
              </div>
            </div>
          )
        })}
      </div>
      {/* {template.parentTemplate && <>Parent Template: <Link to={`/template/${template.parentTemplate}`}>{template.parentTemplate}</Link></>} */}
      <div className='template-step-wrapper'>
        <WhichStep
          template={template}
          formData={formData}
          onChange={onChange}
          startNow={startNow}
          startLater={startLater}
        />
      </div>
      <div>
        {activeStep > 1 && activeStep < 5 && (
          <button
            className='steps-button'
            onClick={() => setActiveStep(activeStep - 1)}>
            Back
          </button>
        )}
        {activeStep < 4 && (
          <button
            className='steps-button'
            onClick={() => setActiveStep(activeStep + 1)}>
            Next
          </button>
        )}
        {activeStep === 4 && (
          <button className='steps-button' onClick={submit}>
            Submit
          </button>
        )}
      </div>
    </div>
  )
}
