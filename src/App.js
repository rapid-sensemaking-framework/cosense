import React, { Component } from 'react'
import {
  Link,
  HashRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import './App.css'
import Template from './routes/Template'
import EditTemplate from './routes/EditTemplate'
import Process from './routes/Process'
import Home from './routes/Home'

class App extends Component {
  render() {

    const menuItems = [
      ['Home', '/'],
      ['My Dashboard', '/'],
      ['Participant Lists', '']
    ]
    return (
      <Router>
        <div className="app">
          <div className="menu">
            <div className="logo" />
            <div className="nav">
              {menuItems.map((i, index) => {
                return <Link to={i[1]} key={index} className={index === 0 ? 'active' : ''}>
                  <div className="menuImage" />
                  {i[0]}
                </Link>
              })}
            </div>
          </div>
          <div className="main">
            <Switch>
              <Route exact path="/template/:templateId" component={Template} />
              <Route path="/template/:templateId/edit" component={EditTemplate} />
              <Route path="/process/:processId" component={Process} />
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App;
