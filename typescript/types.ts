import { ContactableConfig, ParticipantRegisterConfig } from 'rsf-types'

interface ParticipantList {
  name: string
  slug: string
  createdAt: number
  participants: ContactableConfig[]
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
  processConfig: ProcessConfig
  templateId: string
  template: Template
}

interface GetTemplateInput {
  templateId: string
  userDefined: boolean
}

interface ProcessConfig {
  // step 1
  name: string
  templateSpecific: object
  // step 2
  participantsConfig: {
    method: string
    participants: ContactableConfig[]
    participantList: ParticipantList
    publicLink: ParticipantRegisterConfig
  }
  // step 3
  sendToAll: boolean
}

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
  processConfig: ProcessConfig
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

type Handler = (handlerInput: any) => Promise<any>

export {
  ParticipantList,
  Template,
  UpdateTemplateInput,
  TemplateSubmitInput,
  GetTemplateInput,
  ProcessConfig,
  ExpectedInput,
  Process,
  GraphConnection,
  NofloSignal,
  NofloSignalPayload,
  Graph,
  Handler
}
