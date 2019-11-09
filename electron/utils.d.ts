declare const guidGenerator: () => string;
declare const remainingTime: (maxTime: number, startTime: number) => number;
declare const getRegisterAddress: (env: any, protocolKey: any) => string;
export { guidGenerator, remainingTime, getRegisterAddress };
