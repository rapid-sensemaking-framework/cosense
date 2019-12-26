import { ContactableConfig } from 'rsf-types'

interface ParticipantList {
  name: string
  participants: ContactableConfig[]
}

interface RegisterConfig {
  stage: string
  isFacilitator: boolean
  processContext: string
  maxTime: number
  maxParticipants: number | string
  id: string
  wsUrl: string // websocket to connect to, if not isFacilitator
}

interface ExpectedInput {
  process: string
  port: string
  help?: string
  shortLabel?: string
  label?: string
  type?: string
  component?: string
  inputTypeOverride?: string
  defaultValue?: any
  placeholder?: string
}

interface Template {
  name: string
  graphName: string
  description: string
  resultType: string
  expectedInputs: ExpectedInput[]
  id: string
  path?: string
  parentTemplate?: string // references another template by its id
}

interface UpdateTemplateInput {
  name: string
  description: string
  expectedInputs: ExpectedInput[]
  templateId: string
}

interface TemplateSubmitInput {
  inputs: FormInputs
  templateId: string
  template: Template
}

interface GetTemplateInput {
  templateId: string
  userDefined: boolean
}

type RegisterConfigSet = {
  [key: string]: RegisterConfig
}

type ContactableConfigSet = {
  [key: string]: ContactableConfig[]
}

type FormInputs = object

interface Process {
  id: string
  name: string
  templateId: string
  template: Template
  graph: Graph
  configuring: boolean
  running: boolean
  complete: boolean
  results?: any
  error?: any
  createdTime: number
  startTime: number
  endTime: number
  formInputs: FormInputs
  registerConfigs: RegisterConfigSet
  participants: ContactableConfigSet
}

interface Graph {
  properties: object
  connections: Array<GraphConnection>
  processes: {
    [key: string]: {
      component: string
      metadata: object
    }
  }
}

interface GraphConnection {
  tgt: {
    // target
    process: string
    port: string
  }
  metadata?: object
  src?: {
    process: string
    port: string
  }
  data?: any
}

interface NofloSignalPayload {
  id: string // like 'rsf/CollectResponses_ey8mk() STATEMENT -> IN core/Output()'
  graph: string // like '9.383107155431603randomid'
  src?: {
    node: string
    port: string
  }
  tgt: {
    node: string
    port: string
  }
  data: any
}

interface NofloSignal {
  command: string
  payload: NofloSignalPayload
}

interface HandlerInput {
  input: string
}

type Handler = (handlerInput: HandlerInput) => Promise<any>

export {
  ParticipantList,
  ContactableConfigSet,
  RegisterConfig,
  RegisterConfigSet,
  Template,
  UpdateTemplateInput,
  TemplateSubmitInput,
  GetTemplateInput,
  FormInputs,
  ExpectedInput,
  Process,
  GraphConnection,
  NofloSignal,
  NofloSignalPayload,
  Graph,
  Handler,
  HandlerInput
}
