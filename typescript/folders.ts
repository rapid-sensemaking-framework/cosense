const isRenderer = typeof window !== 'undefined'
const app = isRenderer
  ? window.require('electron').remote.app
  : require('electron').app
const path = isRenderer
  ? window.require('electron').remote.require('path')
  : require('path')

const APP_DATA = 'CoSense'
const APP_DATA_PATH = path.join(app.getPath('appData'), APP_DATA)

const USER_PROCESSES_PATH = path.join(APP_DATA_PATH, 'processes')
const USER_TEMPLATES_PATH = path.join(APP_DATA_PATH, 'templates')

const SYSTEM_TEMPLATES_PATH = path.join(app.getAppPath(), 'templates')
const SYSTEM_GRAPHS_PATH = path.join(app.getAppPath(), 'graphs')

const PARTICIPANT_LISTS_PATH = path.join(APP_DATA_PATH, 'participant_lists')

export {
  APP_DATA_PATH,
  USER_PROCESSES_PATH,
  USER_TEMPLATES_PATH,
  SYSTEM_TEMPLATES_PATH,
  SYSTEM_GRAPHS_PATH,
  PARTICIPANT_LISTS_PATH
}
