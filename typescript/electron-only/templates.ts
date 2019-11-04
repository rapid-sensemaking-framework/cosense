import {
  Template, Graph,
} from '../react-electron/types'
import {
  newProcess,
  runProcess
} from './process_model'

const handleTemplateSubmit = async (
    { inputs, templateId, template, graph }:
    { inputs, templateId: string, template: Template, graph: Graph }
  ) => {
  const runtimeAddress = process.env.ADDRESS
  const runtimeSecret = process.env.TOP_SECRET
  const wsUrl = process.env.REGISTER_WS_URL
  const processId = await newProcess(
    inputs,
    templateId,
    template,
    graph,
    runtimeAddress,
    runtimeSecret,
    wsUrl
  )
  // kick it off, but don't wait on it, or depend on it for anything
  runProcess(processId, runtimeAddress, runtimeSecret)
  return processId
}

export {
  handleTemplateSubmit
}

