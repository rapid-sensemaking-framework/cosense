const electron = window.require('electron')

const getElectron = () => {
  return electron
}
export { getElectron }

const electronRequire = (nodeMod) => {
  return electron.remote.require(nodeMod)
}
export default electronRequire