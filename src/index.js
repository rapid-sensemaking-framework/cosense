// This must be the first line in src/index.js
import 'react-app-polyfill/stable'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
