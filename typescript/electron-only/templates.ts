import * as electron from 'electron'
import * as path from 'path'
import {
  Template, Graph,
} from '../types'
import {
  newProcess,
  runProcess
} from './process_model'
import {
  getRegisterAddress
} from '../utils'
import { componentMetaForStages } from './fbp'

const getGraph = (templateId: string): Graph => {
  const graphPath = path.join(electron.app.getAppPath(), `graphs/${templateId}.json`)
  return require(graphPath)
}

const handleTemplateSubmit = async (
    { inputs, templateId, template }:
    { inputs, templateId: string, template: Template }
  ) => {
  const registerWsUrl = getRegisterAddress(process.env, 'REGISTER_WS_PROTOCOL')
  // not a bug, templateId is shared with graphId
  const graph = getGraph(templateId)
  const processId = await newProcess(
    inputs,
    templateId,
    template,
    graph,
    registerWsUrl
  )
  // kick it off, but don't wait on it, or depend on it for anything
  const runtimeAddress = process.env.RUNTIME_ADDRESS
  const runtimeSecret = process.env.RUNTIME_SECRET
  runProcess(processId, runtimeAddress, runtimeSecret)
  return processId
}

const getTemplate = async (templateId: string, runtimeAddress: string, runtimeSecret: string) => {
  const templatePath = path.join(electron.app.getAppPath(), `templates/${templateId}.template.json`)
  const template: Template = require(templatePath)
  if (template) {
    // react router route
    template.path = `/template/${templateId}`
    const graph = getGraph(templateId)
    const stages = await componentMetaForStages(template.stages, graph, runtimeAddress, runtimeSecret)
    template.stages = stages
  }
  return template
}

export {
  handleTemplateSubmit,
  getTemplate
}
