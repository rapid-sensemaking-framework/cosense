import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
// import './App.css'
import Template from './routes/Template/Template'
import Process from './routes/Process'
import Home from './routes/Home'

class App extends Component {
  render() {
    return (
      <Router>
        <Link to="/">Home</Link>
        <div className="main">
          <Switch>
            <Route path="/template/:templateId">
              <Template />
            </Route>
            <Route path="/process/:processId">
              <Process />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;
