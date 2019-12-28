import { ParticipantList } from '../types';
declare const updateParticipantList: (updatedParticipantList: ParticipantList) => Promise<boolean>;
declare const createParticipantList: (participantList: ParticipantList) => Promise<boolean>;
declare const getParticipantLists: () => Promise<ParticipantList[]>;
declare const getParticipantList: (slug: string) => Promise<ParticipantList>;
export { updateParticipantList, createParticipantList, getParticipantLists, getParticipantList };
