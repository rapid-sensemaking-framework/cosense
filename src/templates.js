import {
  EVENTS
} from './ts-built/constants'
import electronRequire, { getElectron} from './electron-require'
const path = electronRequire('path')
const fs = electronRequire('fs')
const ipc = getElectron().ipcRenderer
const { app } = getElectron().remote

export function getTemplates() {
  return new Promise((resolve, reject) => {
    const templatesPath = path.join(app.getAppPath(), 'templates')
    fs.readdir(templatesPath, (err, files) => {
      if (err) {
        reject(err)
        return
      }
      const templates = files.map(filename => {
        const templatePath = path.join(app.getAppPath(), `templates/${filename}`)
        const template = electronRequire(templatePath)
        const shortName = filename.replace('.template.json', '')
        template.path = `/template/${shortName}`
        return template
      })
      resolve(templates)
    })
  })
}

export async function getTemplate(templateId) {
  ipc.send(EVENTS.IPC.GET_TEMPLATE, templateId)
  return await new Promise((resolve) => {
    ipc.once(EVENTS.IPC.RETURN_TEMPLATE, (event, template) => resolve(template))
  })
}