import electronRequire, { getElectron} from './electron-require'
const fs = electronRequire('fs')
const path = electronRequire('path')
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
  const templatePath = path.join(app.getAppPath(), `templates/${templateId}.template.json`)
  const template = electronRequire(templatePath)
  if (template) {
    template.path = `/template/${templateId}`
  }
  return template
}