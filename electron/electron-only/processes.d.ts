import { ContactableConfig, RegisterConfig, Process, Template, ExpectedInput, GraphConnection, Graph } from '../types';
declare const getProcesses: () => Promise<Process[]>;
declare const getProcess: (id: string) => Promise<Process>;
declare const setProcessProp: (id: string, key: string, value: any) => Promise<boolean>;
declare const newProcess: (formInputs: object, templateId: string, template: Template, graph: Graph, registerWsUrl: string) => Promise<string>;
declare const cloneProcess: (processId: any) => Promise<string>;
interface HandlerInput {
    input?: string;
    registerConfig?: RegisterConfig;
    callback?: (c: ContactableConfig) => void;
    participants?: ContactableConfig[];
}
declare type Handler = (handlerInput: HandlerInput) => Promise<any>;
declare const handleOptionsData: Handler;
declare const handleRegisterConfig: Handler;
declare const mapInputToHandler: (expectedInput: ExpectedInput) => Handler;
declare const convertToGraphConnection: (process: string, port: string, data: any) => GraphConnection;
declare const runProcess: (processId: string, runtimeAddress: string, runtimeSecret: string) => Promise<void>;
declare const getRegisterConfig: (formInputs: object, process: string, id: string, wsUrl: string) => RegisterConfig;
export { getProcesses, getProcess, setProcessProp, newProcess, cloneProcess, runProcess, getRegisterConfig, handleRegisterConfig, convertToGraphConnection, handleOptionsData, mapInputToHandler };
