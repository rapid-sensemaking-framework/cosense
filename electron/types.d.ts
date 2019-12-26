import { ContactableConfig } from 'rsf-types';
interface ParticipantList {
    name: string;
    slug: string;
    participants: ContactableConfig[];
}
interface RegisterConfig {
    stage: string;
    isFacilitator: boolean;
    processContext: string;
    maxTime: number;
    maxParticipants: number | string;
    id: string;
    wsUrl: string;
}
interface ExpectedInput {
    process: string;
    port: string;
    help?: string;
    shortLabel?: string;
    label?: string;
    type?: string;
    component?: string;
    inputTypeOverride?: string;
    defaultValue?: any;
    placeholder?: string;
}
interface Template {
    name: string;
    graphName: string;
    description: string;
    resultType: string;
    expectedInputs: ExpectedInput[];
    id: string;
    path?: string;
    parentTemplate?: string;
}
interface UpdateTemplateInput {
    name: string;
    description: string;
    expectedInputs: ExpectedInput[];
    templateId: string;
}
interface TemplateSubmitInput {
    inputs: FormInputs;
    templateId: string;
    template: Template;
}
interface GetTemplateInput {
    templateId: string;
    userDefined: boolean;
}
declare type RegisterConfigSet = {
    [key: string]: RegisterConfig;
};
declare type ContactableConfigSet = {
    [key: string]: ContactableConfig[];
};
declare type FormInputs = object;
interface Process {
    id: string;
    name: string;
    templateId: string;
    template: Template;
    graph: Graph;
    configuring: boolean;
    running: boolean;
    complete: boolean;
    results?: any;
    error?: any;
    createdTime: number;
    startTime: number;
    endTime: number;
    formInputs: FormInputs;
    registerConfigs: RegisterConfigSet;
    participants: ContactableConfigSet;
}
interface Graph {
    properties: object;
    connections: Array<GraphConnection>;
    processes: {
        [key: string]: {
            component: string;
            metadata: object;
        };
    };
}
interface GraphConnection {
    tgt: {
        process: string;
        port: string;
    };
    metadata?: object;
    src?: {
        process: string;
        port: string;
    };
    data?: any;
}
interface NofloSignalPayload {
    id: string;
    graph: string;
    src?: {
        node: string;
        port: string;
    };
    tgt: {
        node: string;
        port: string;
    };
    data: any;
}
interface NofloSignal {
    command: string;
    payload: NofloSignalPayload;
}
interface HandlerInput {
    input: string;
}
declare type Handler = (handlerInput: HandlerInput) => Promise<any>;
export { ParticipantList, ContactableConfigSet, RegisterConfig, RegisterConfigSet, Template, UpdateTemplateInput, TemplateSubmitInput, GetTemplateInput, FormInputs, ExpectedInput, Process, GraphConnection, NofloSignal, NofloSignalPayload, Graph, Handler, HandlerInput };
