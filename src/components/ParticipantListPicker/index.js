import React, { useState } from 'react'
import moment from 'moment'
import './ParticipantListPicker.css'
import Modal from '../Modal'
import ParticipantList from '../ParticipantList'

function ParticipantListItem({ list, onClick }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className='participant-list-item'>
      <div
        className='participant-list-item-name input-label'
        onClick={() => onClick(list)}>
        {list.name} ({list.participants.length})
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
        <div className='input-label'>Choose one of your participant lists</div>
        {/* <div className='input-help-label'>
          You can edit them after selection
        </div> */}
      </div>
      <div className='participant-list-picker-list'>
        {participantLists.map((list, index) => {
          return (
            <ParticipantListItem list={list} key={index} onClick={selectList} />
          )
        })}
      </div>
    </Modal>
  )
}

export default function ParticipantListPicker({
  contactableConfigs,
  selectedList,
  updateSelectedList,
  participantLists,
  cancel
}) {
  return (
    <div className='participant-list-picker'>
      {!selectedList && (
        <ListPickerModal
          participantLists={participantLists}
          cancel={cancel}
          selectList={updateSelectedList}
        />
      )}
      {selectedList && (
        <div className='input-wrapper'>
          <div className='participant-list-picker-selected'>
            <div className='input-label'>
              {selectedList.name} ({selectedList.participants.length})
            </div>
            <div
              className='participant-list-picker-change'
              onClick={() => updateSelectedList(null)}>
              change
            </div>
          </div>
          <div className='input-help-label'>
            Created {moment(selectedList.createdAt).calendar()}
          </div>
        </div>
      )}
      {contactableConfigs && contactableConfigs.length > 0 && (
        <ParticipantList contactables={contactableConfigs} />
      )}
    </div>
  )
}
