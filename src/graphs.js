import electronRequire, { getElectron} from './electron-require'
const path = electronRequire('path')
const { app } = getElectron().remote

export async function getGraph(graphId) {
  const graphPath = path.join(app.getAppPath(), `graphs/${graphId}.json`)
  return electronRequire(graphPath)
}