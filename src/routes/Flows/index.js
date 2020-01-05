import React, { useState, useEffect } from 'react'
import { Link, useRouteMatch, Route, Switch } from 'react-router-dom'
import { getProcesses } from '../../ipc'
import './Flows.css'
import { URLS, CONTACTABLE_CONFIG_PORT_NAME } from '../../ts-built/constants'
import { USER_PROCESSES_PATH } from '../../ts-built/folders'
import LabeledValue from '../../components/LabeledValue'
import Flow from '../Flow'
import { getElectron } from '../../electron-require'
const { shell } = getElectron()

function FlowGridElement({ flow }) {
  const { participants } = flow.processConfig.participantsConfig
  return (
    <Link
      className='flow-grid-link'
      to={URLS.PROCESS.replace(':processId', flow.id)}
      key={`flow-${flow.id}`}>
      {flow.running && <div className='flow-is-live' />}
      <div className='flow-grid-bg'>
        <LabeledValue label={'Participants'} value={participants.length} />
        <LabeledValue
          label={'Responses'}
          value={flow.results ? flow.results.length : 0}
        />
        <div className='flow-grid-bg-button-wrapper'>
          <button className='button'>See Details</button>
        </div>
      </div>
      <div className='flow-grid-name'>My Flow 1</div>
      <div className='flow-grid-one-liner'>{flow.template.name}</div>
    </Link>
  )
}

function FlowSubsection({ flows, label }) {
  return (
    <>
      <div className='flows-section-label'>{label}</div>
      <div className='flows-container'>
        {/* sort by most recently started */}
        {flows
          .sort((a, b) => (a.startTime > b.startTime ? -1 : 1))
          .map(flow => (
            <FlowGridElement flow={flow} />
          ))}
      </div>
    </>
  )
}

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

  const runningFlows = flows.filter(f => f.running)
  const completedFlows = flows.filter(f => f.complete)
  const configuringFlows = flows.filter(f => f.configuring)

  const openFlowsFolder = e => {
    e.preventDefault()
    shell.openItem(USER_PROCESSES_PATH)
  }

  return (
    <>
      <FlowSubsection flows={runningFlows} label='Live flows' />
      <div className='divider' />
      <FlowSubsection flows={configuringFlows} label='Configured unrun flows' />
      <div className='divider' />
      <FlowSubsection flows={completedFlows} label='Previously run flows' />
      <div className='divider' />
      <a href='#' onClick={openFlowsFolder}>
        Open Folder With Flows
      </a>
    </>
  )
}

export default function Home() {
  const { url } = useRouteMatch()
  return (
    <>
      <h1>My Dashboard</h1>
      <div className='flows-wrapper'>
        <Switch>
          <Route path={`${url}/:processId`} component={Flow} />
          <Route path={url} component={FlowsContainer} />
        </Switch>
      </div>
    </>
  )
}
