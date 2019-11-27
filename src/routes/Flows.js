import React, { useState, useEffect } from 'react'
import moment from 'moment'
import {
  Link,
  useRouteMatch,
  Route,
  Switch
} from 'react-router-dom'
import {
  getProcesses
} from '../ipc'
import './Flows.css'
import {
  URLS
} from '../ts-built/constants'
import Flow from './Flow'

function FlowsContainer() {
  const defaultFlows = []
  const [flows, setFlows] = useState(defaultFlows)
  useEffect(() => {
    getProcesses()
      .then(setFlows)
      .catch(err => {
        console.log(err)
      })
  }, []) // << super important array, prevents re-fetching

  return <div className="flows-container">
    {flows
      .sort((a, b) => a.startTime > b.startTime ? -1 : 1)
      .map((flow, flowIndex) => {
        const status = flow.complete
          ? 'Complete'
          : flow.error
            ? 'Error'
            : flow.configuring
              ? 'Configuring'
              : flow.running
                ? 'Running'
                : 'Unknown Status'

        const dateString = moment(flow.startTime).fromNow()
        return <Link className="flow-grid-link" to={URLS.PROCESS.replace(':processId', flow.id)} key={`flow-${flowIndex}`}>
          <div className="flow-grid-image" />
          <div className="flow-grid-name">{flow.template.name}</div>
          <div className="flow-grid-one-liner">{status}</div>
          <div className="flow-grid-one-liner">Started: {dateString}</div>
        </Link>
      })}
  </div>
}

export default function Home() {
  const { url } = useRouteMatch()
  return <>
    <h1>My Dashboard</h1>
    <div className="flows-wrapper">
      <Switch>
        <Route path={`${url}/:processId`} component={Flow} />
        <Route path={url} component={FlowsContainer} />
      </Switch>
    </div>
  </>
}