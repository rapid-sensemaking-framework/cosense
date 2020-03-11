import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { getElectron } from './electron-require'
const electron = getElectron()
const { remote } = electron
const { Menu, MenuItem } = remote

ReactDOM.render(<App />, document.getElementById('root'))

/* Right Click Menu */
const menu = new Menu()
menu.append(new MenuItem({ role: 'undo' }))
menu.append(new MenuItem({ role: 'redo' }))
menu.append(new MenuItem({ role: 'cut' }))
menu.append(new MenuItem({ role: 'copy' }))
menu.append(new MenuItem({ role: 'paste' }))

window.addEventListener(
  'contextmenu',
  e => {
    e.preventDefault()
    menu.popup({ window: remote.getCurrentWindow() })
  },
  false
)
