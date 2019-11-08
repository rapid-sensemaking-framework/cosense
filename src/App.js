import React, { Component } from 'react'
import {
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
// import './App.css'
import Template from './routes/Template'
import EditTemplate from './routes/EditTemplate'
import Process from './routes/Process'
import Home from './routes/Home'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="main">
          <Switch>
            <Route exact path="/template/:templateId" component={Template} />
            <Route path="/template/:templateId/edit" component={EditTemplate} />
            <Route path="/process/:processId" component={Process} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App;
