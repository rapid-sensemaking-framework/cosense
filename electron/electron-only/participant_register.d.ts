import { ContactableConfig } from 'rsf-types';
declare const getContactablesFromFacilitator: (id: string) => Promise<ContactableConfig[]>;
declare const getContactablesFromRegistration: (wsUrl: string, id: string, maxTime: number, maxParticipants: any, processDescription: string, eachNew?: (newParticipant: ContactableConfig) => void) => Promise<ContactableConfig[]>;
export { getContactablesFromFacilitator, getContactablesFromRegistration };
