import { GraphConnection, Graph } from '../types';
declare const start: (jsonGraph: any, runtimeAddress: string, runtimeSecret: string, dataWatcher?: (signal: any) => void) => Promise<void>;
declare const overrideJsonGraph: (graphConnections: GraphConnection[], graph: Graph) => {
    properties: {
        name: string;
    };
    connections: GraphConnection[];
    processes: {
        [key: string]: {
            component: string;
            metadata: object;
        };
    };
};
export { overrideJsonGraph, start };
