import { Graph, ExpectedInput } from '../types';
declare const createFbpClient: (address: string, secret: string) => Promise<any>;
declare const componentMeta: (expectedInputs: ExpectedInput[], graph: Graph, runtimeAddress: string, runtimeSecret: string) => Promise<ExpectedInput[]>;
export { createFbpClient, componentMeta };
