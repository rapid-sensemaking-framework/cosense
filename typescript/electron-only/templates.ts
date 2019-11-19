import * as electron from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import {
  Template, Graph, ExpectedInput,
} from '../types'
import {
  newProcess,
  runProcess
} from './processes'
import {
  getRegisterAddress, guidGenerator
} from '../utils'
import { componentMeta } from './fbp'

const TEMPLATES_FOLDER = 'templates'

const getGraph = (graphName: string): Graph => {
  const graphPath = path.join(electron.app.getAppPath(), `graphs/${graphName}`)
  return require(graphPath)
}

const getTemplatePath = (templateId: string): string => {
  return path.join(electron.app.getAppPath(), `${TEMPLATES_FOLDER}/${templateId}.template.json`)
}

const getTemplateAsObject = (templateId: string): Template => {
  const templatePath = getTemplatePath(templateId)
  const templateString = fs.readFileSync(templatePath, { encoding: "utf8" })
  const template: Template = JSON.parse(templateString)
  return template
}

const writeTemplate = (templateId, template) => {
  const templatePath = getTemplatePath(templateId)
  fs.writeFileSync(templatePath, JSON.stringify(template))
}

const updateTemplate = async (
  { name, description, expectedInputs, templateId }:
    { name: string, description: string, expectedInputs, templateId: string }
): Promise<boolean> => {
  const orig = getTemplateAsObject(templateId)
  const newTemplate: Template = {
    ...orig,
    name,
    description,
    expectedInputs: orig.expectedInputs.map(e => {
      // TODO consolidate references like these
      const key = `${e.process}--${e.port}`
      const defaultValue = expectedInputs[key]
      if (defaultValue) {
        return {
          ...e,
          defaultValue
        }
      } else {
        return e
      }
    })
  }
  writeTemplate(templateId, newTemplate)
  return true
}

// TODO: should this be in processes file?
const handleTemplateSubmit = async (
  { inputs, templateId, template }:
    { inputs, templateId: string, template: Template }
) => {
  const registerWsUrl = getRegisterAddress(process.env, 'REGISTER_WS_PROTOCOL')
  // not a bug, templateId is shared with graphId
  const graph = getGraph(template.graphName)
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

const getTemplates = async (): Promise<Template[]> => {
  return new Promise((resolve, reject) => {
    const templatesPath = path.join(electron.app.getAppPath(), TEMPLATES_FOLDER)
    fs.readdir(templatesPath, (err, files) => {
      if (err) {
        reject(err)
        return
      }
      const templates = files.map(filename => {
        const templatePath = path.join(electron.app.getAppPath(), `${TEMPLATES_FOLDER}/${filename}`)
        const template = JSON.parse(fs.readFileSync(templatePath, { encoding: 'utf8' }))
        const shortName = filename.replace('.template.json', '')
        // react router route
        template.path = `/template/${shortName}`
        return template
      })
      resolve(templates)
    })
  })
}

const getTemplate = async (templateId: string, runtimeAddress: string, runtimeSecret: string): Promise<Template> => {
  let template: Template
  try {
    template = getTemplateAsObject(templateId)
  } catch (e) {
    console.log(e)
  }
  let reactPath: string, expectedInputs: ExpectedInput[]
  if (template) {
    // react router route
    reactPath = `/template/${templateId}`
    // use parentTemplate as the default,
    // because it will have the id that matches the graph file name
    const graph = getGraph(template.graphName)
    expectedInputs = await componentMeta(template.expectedInputs, graph, runtimeAddress, runtimeSecret)
  }
  return {
    ...template,
    path: reactPath,
    expectedInputs
  }
}

const cloneTemplate = async (templateId): Promise<string> => {
  let orig = getTemplateAsObject(templateId)
  const newGuid = guidGenerator()
  const id = orig.id + '-' + newGuid
  const name = orig.name + '-' + newGuid.slice(0, 5)
  const newTemplate = {
    ...orig,
    id,
    name,
    parentTemplate: orig.id
  }
  writeTemplate(id, newTemplate)
  return newTemplate.id
}

export {
  updateTemplate,
  handleTemplateSubmit,
  getTemplates,
  getTemplate,
  cloneTemplate
}
