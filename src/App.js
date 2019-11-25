import React, { Component } from 'react'
import {
  NavLink,
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import './App.css'
import Template from './routes/Template'
import EditTemplate from './routes/EditTemplate'
import Process from './routes/Process'
import Flows from './routes/Flows'
import Home from './routes/Home'

class App extends Component {
  render() {

    const menuItems = [
      ['Home', '/'],
      ['My Dashboard', '/process'],
      // ['Participant Lists', '/']
    ]
    return (
      <Router>
        <div className="app">
          <div className="menu">
            <div className="logo" />
            <div className="nav">
              {menuItems.map(([label, path], index) => {
                return <NavLink to={path} key={index} exact={path === '/'} activeClassName="active">
                  <div className="menuImage" />
                  {label}
                </NavLink>
              })}
            </div>
          </div>
          <div className="main">
            <Switch>
              <Route exact path="/template/:templateId" component={Template} />
              <Route path="/template/:templateId/edit" component={EditTemplate} />
              <Route path="/process/:processId" component={Process} />
              <Route path="/process" component={Flows} />
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App;
