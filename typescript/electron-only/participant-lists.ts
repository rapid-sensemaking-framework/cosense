import * as fs from 'fs'
import { ParticipantList } from '../types'
import { PARTICIPANT_LISTS_PATH } from '../folders'

const getParticipantListPath = (slug: string): string => {
  return `${PARTICIPANT_LISTS_PATH}/${slug}.json`
}

const getParticipantListAsObject = (
  participantListId: string
): ParticipantList => {
  const participantListPath = getParticipantListPath(participantListId)
  const participantListString = fs.readFileSync(participantListPath, {
    encoding: 'utf8'
  })
  const participantList: ParticipantList = JSON.parse(participantListString)
  return participantList
}

const writeParticipantList = (
  participantListId: string,
  participantList: ParticipantList
): boolean => {
  const participantListPath = getParticipantListPath(participantListId)
  fs.writeFileSync(
    participantListPath,
    JSON.stringify(participantList, null, 2)
  )
  return true
}

const updateParticipantList = async (
  updatedParticipantList: ParticipantList
): Promise<boolean> => {
  return writeParticipantList(
    updatedParticipantList.slug,
    updatedParticipantList
  )
}

const createParticipantList = async (participantList: ParticipantList) => {
  writeParticipantList(participantList.slug, participantList)
  return true
}

const getParticipantLists = async (): Promise<ParticipantList[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(PARTICIPANT_LISTS_PATH, (err, files) => {
      if (err) {
        reject(err)
        return
      }
      // filter out .DS_Store and any other weird files
      const participantLists = files
        .filter(f => f.includes('.json'))
        .map(filename => {
          const participantListPath = `${PARTICIPANT_LISTS_PATH}/${filename}`
          const participantListString = fs.readFileSync(participantListPath, {
            encoding: 'utf8'
          })
          const participantList: ParticipantList = JSON.parse(
            participantListString
          )
          return participantList
        })
      resolve(participantLists)
    })
  })
}

const getParticipantList = async (slug: string): Promise<ParticipantList> => {
  let participantList: ParticipantList
  try {
    participantList = getParticipantListAsObject(slug)
  } catch (e) {
    console.log(e)
  }
  return participantList
}

export {
  updateParticipantList,
  createParticipantList,
  getParticipantLists,
  getParticipantList
}
