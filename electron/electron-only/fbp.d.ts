import { Stage, Graph } from '../types';
declare const createFbpClient: (address: string, secret: string) => Promise<any>;
declare const componentMetaForStages: (stages: Stage[], graph: Graph, runtimeAddress: string, runtimeSecret: string) => Promise<Stage[]>;
export { createFbpClient, componentMetaForStages };
