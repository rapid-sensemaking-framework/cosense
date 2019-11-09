interface ContactableConfig {
    type: string;
    id: string;
    name?: string;
}
interface Statement {
    text: string;
}
interface Option {
    triggers: string[];
    text: string;
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
    label?: string;
    type?: string;
    component?: string;
    inputTypeOverride?: string;
    defaultValue?: any;
    placeholder?: string;
}
interface Stage {
    name: string;
    description: string;
    expectedInputs: ExpectedInput[];
}
interface Template {
    name: string;
    graphName: string;
    description: string;
    stages: Stage[];
    resultConnection: string;
    id: string;
    path?: string;
    parentTemplate?: string;
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
    templateId: string;
    template: Template;
    graph: Graph;
    configuring: boolean;
    running: boolean;
    complete: boolean;
    results?: any;
    error?: any;
    startTime: number;
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
export { ContactableConfig, ContactableConfigSet, Statement, Option, RegisterConfig, RegisterConfigSet, Template, Stage, FormInputs, ExpectedInput, Process, GraphConnection, Graph };
