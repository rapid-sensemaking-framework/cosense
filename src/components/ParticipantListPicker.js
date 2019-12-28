import React, { useState } from 'react'
import moment from 'moment'
import './ParticipantListPicker.css'

function ParticipantList({ list }) {
  return (
    <div className='participant-list'>
      <div className='participant-list-name input-label'>{list.name}</div>
      <div className='participant-list-created-at input-help-label'>
        Created {moment(list.createdAt).calendar()}
      </div>
    </div>
  )
}

function ListPickerModal({ cancel, participantLists }) {
  return (
    <div className='participant-list-picker-backdrop'>
      <div className='participant-list-picker-modal'>
        <div onClick={cancel} className='participant-list-picker-cancel'>
          &#215;
        </div>
        <div className='input-label'>Choose one of your participant lists</div>
        <div className='input-help-label'>
          You can edit them after selection
        </div>
        <div className='participant-list-picker-list'>
          {participantLists.map((list, index) => {
            return <ParticipantList list={list} key={index} />
          })}
        </div>
      </div>
    </div>
  )
}

const participantLists = []
for (let i = 0; i < 10; i++) {
  participantLists.push({
    name: 'Participants for Workshop xyzzy ',
    slug: 'test',
    createdAt: Date.now(),
    participants: [
      {
        id: 'connorturland',
        type: 'telegram'
      }
    ]
  })
}

export default function ParticipantListPicker({
  template,
  formData,
  onChange,
  cancel
}) {
  const [selectedList, setSelectedList] = useState(null)

  return (
    <>
      {!selectedList && (
        <ListPickerModal participantLists={participantLists} cancel={cancel} />
      )}
    </>
  )
}
