import { ContactableConfig } from 'rsf-types';
declare const getContactablesFromRegistration: (wsUrl: string, id: string, maxTime: number, maxParticipants: any, processDescription: string, eachNew?: (newParticipant: ContactableConfig) => void) => Promise<ContactableConfig[]>;
export { getContactablesFromRegistration };
