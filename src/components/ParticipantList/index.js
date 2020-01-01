import React from 'react'
import './ParticipantList.css'

function ParticipantListRow({ num, header, col1, col2, col3 }) {
  return <div className={`participant-list-row ${header ? 'participant-list-header' : ''}`}>
    <div className="participant-list-count">{num}{!header && '.'}</div>
    <div className="participant-list-column">{col1}</div>
    <div className="participant-list-column">{col2}</div>
    <div className="participant-list-column">{col3}</div>
  </div>
}

export default function ParticipantList({ contactables }) {
  return <div className="participant-list">
    <ParticipantListRow header col1="participant name" col2="contact platform" col3="identity" />
    {contactables.map((c, index) => {
      return <ParticipantListRow key={index} num={index + 1} col1={c.name} col2={c.type} col3={c.id} />
    })}
  </div>
}