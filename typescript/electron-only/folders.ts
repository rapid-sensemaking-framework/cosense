import * as electron from 'electron'
import * as path from 'path'

const APP_DATA = 'CoSense'
const APP_DATA_PATH = path.join(electron.app.getPath('appData'), APP_DATA)

const USER_PROCESSES_PATH = path.join(APP_DATA_PATH, 'processes')
const USER_TEMPLATES_PATH = path.join(APP_DATA_PATH, 'templates')

const SYSTEM_TEMPLATES_PATH = path.join(electron.app.getAppPath(), 'templates')
const SYSTEM_GRAPHS_PATH = path.join(electron.app.getAppPath(), 'graphs')

export {
  APP_DATA_PATH,
  USER_PROCESSES_PATH,
  USER_TEMPLATES_PATH,
  SYSTEM_TEMPLATES_PATH,
  SYSTEM_GRAPHS_PATH
}