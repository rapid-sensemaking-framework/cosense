import React, { useState } from 'react'
import moment from 'moment'
import './ParticipantListPicker.css'
import { CONTACTABLE_CONFIG_PORT_NAME } from '../ts-built/constants'
import Modal from './Modal'
import ParticipantList from './ParticipantList'

function ParticipantListItem({ list, onClick }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className='participant-list-item'>
      <div
        className='participant-list-item-name input-label'
        onClick={() => onClick(list)}>
        {list.name}
      </div>
      <div
        className='participant-list-item-created-at input-help-label'
        onClick={() => onClick(list)}>
        Created {moment(list.createdAt).calendar()}
      </div>
      <div
        onClick={() => setExpanded(!expanded)}
        className='participant-list-item-expand'>
        {expanded ? 'Hide' : 'Show'} List
      </div>
      {expanded && <ParticipantList contactables={list.participants} />}
    </div>
  )
}

function ListPickerModal({ cancel, participantLists, selectList }) {
  return (
    <Modal cancel={cancel}>
        <div className='participant-list-picker-header'>
          <div className='input-label'>
            Choose one of your participant lists
          </div>
          <div className='input-help-label'>
            You can edit them after selection
          </div>
        </div>
        <div className='participant-list-picker-list'>
          {participantLists.map((list, index) => {
            return (
              <ParticipantListItem
                list={list}
                key={index}
                onClick={selectList}
              />
            )
          })}
        </div>
    </Modal>
  )
}

export default function ParticipantListPicker({
  template,
  formData,
  onChange,
  participantLists,
  cancel
}) {
  const expectedContactables = template.expectedInputs.find(
    e =>
      e.port === CONTACTABLE_CONFIG_PORT_NAME &&
      !e.process.includes('SendMessageToAll')
  )
  const ident = `${expectedContactables.process}--${expectedContactables.port}`
  const els = formData[ident]

  const [selectedList, setSelectedList] = useState(null)

  return (
    <div className='participant-list-picker'>
      {!selectedList && (
        <ListPickerModal
          participantLists={participantLists}
          cancel={cancel}
          selectList={list => {
            setSelectedList(list)
            onChange(ident, list.participants)
          }}
        />
      )}
      {selectedList && selectedList.name}
      {els && els.length && <ParticipantList contactables={els} />}
    </div>
  )
}
