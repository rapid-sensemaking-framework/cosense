import { ProcessConfig } from './types'

const FROM_EXISTING_LIST = 'from_existing_list'
const FROM_CUSTOM_LIST = 'from_custom_list'
const FROM_PUBLIC_LINK = 'from_public_link'

function defaultProcessConfig(): ProcessConfig {
  return {
    // step 1
    templateSpecific: {},
    // step 2
    participantsConfig: {
      method: '',
      participants: [],
      participantList: null,
      publicLink: {
        description: '',
        maxTime: 5 * 60, // 5 minutes, in seconds
        maxParticipants: '*' // Unlimited
      }
    },
    // step 3
    sendToAll: true
  }
}

export {
  defaultProcessConfig,
  FROM_CUSTOM_LIST,
  FROM_EXISTING_LIST,
  FROM_PUBLIC_LINK
}
