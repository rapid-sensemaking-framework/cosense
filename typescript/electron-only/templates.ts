import * as path from 'path'
import * as fs from 'fs'
import {
  Template, Graph, ExpectedInput, TemplateSubmitInput, UpdateTemplateInput,
} from '../types'
import {
  newProcess,
} from './processes'
import {
  getRegisterAddress, guidGenerator
} from '../utils'
import { componentMeta } from './fbp'
import {
  USER_TEMPLATES_PATH, // user defined
  SYSTEM_TEMPLATES_PATH,
  SYSTEM_GRAPHS_PATH
} from './folders'

const getGraph = (graphName: string): Graph => {
  const graphPath = path.join(SYSTEM_GRAPHS_PATH, graphName)
  return require(graphPath)
}

const getTemplatePath = (templateId: string, userDefined: boolean = false): string => {
  const whichOnes = userDefined ? USER_TEMPLATES_PATH : SYSTEM_TEMPLATES_PATH
  return `${whichOnes}/${templateId}.template.json`
}

const getTemplateAsObject = (templateId: string, userDefined: boolean = false): Template => {
  const templatePath = getTemplatePath(templateId, userDefined)
  const templateString = fs.readFileSync(templatePath, { encoding: "utf8" })
  const template: Template = JSON.parse(templateString)
  return template
}

const writeTemplate = (templateId: string, template: Template): boolean => {
  // can only write to user defined templates
  const userDefined = true
  const templatePath = getTemplatePath(templateId, userDefined)
  fs.writeFileSync(templatePath, JSON.stringify(template))
  return true
}

const updateTemplate = async (
  { name, description, expectedInputs, templateId }: UpdateTemplateInput
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
  return writeTemplate(templateId, newTemplate)
}

// TODO: should this be in processes file?
const createProcess = async (
  { inputs, templateId, template }: TemplateSubmitInput
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
  return processId
}

const getTemplates = async (userDefined: boolean = false): Promise<Template[]> => {
  return new Promise((resolve, reject) => {
    const templatesPath = userDefined ? USER_TEMPLATES_PATH : SYSTEM_TEMPLATES_PATH
    fs.readdir(templatesPath, (err, files) => {
      if (err) {
        reject(err)
        return
      }
      const templates = files.map(filename => {
        const templatePath = `${templatesPath}/${filename}`
        const templateString = fs.readFileSync(templatePath, { encoding: 'utf8' })
        const template: Template = JSON.parse(templateString)
        const shortName = filename.replace('.template.json', '')
        // react router route
        template.path = `/template/${shortName}`
        return template
      })
      resolve(templates)
    })
  })
}

const getTemplate = async (templateId: string, userDefined: boolean = false, runtimeAddress: string, runtimeSecret: string): Promise<Template> => {
  let template: Template
  try {
    template = getTemplateAsObject(templateId, userDefined)
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

const cloneTemplate = async (templateId: string, userDefined: boolean = false): Promise<string> => {
  let orig = getTemplateAsObject(templateId, userDefined)
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
  createProcess,
  getTemplates,
  getTemplate,
  cloneTemplate
}
