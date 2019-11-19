import React, { useState } from 'react'
import { TYPE_KEY as SMS_TYPE_KEY } from 'rsf-smsable'
import { TYPE_KEY as TELEGRAM_TYPE_KEY } from 'rsf-telegramable'
import { TYPE_KEY as MATTERMOST_TYPE_KEY } from 'rsf-mattermostable'

import './ContactableInput.css'

export default function ContactableInput({ onChange, showRemove, onRemove }) {
  const [type, setType] = useState('telegram')
  const [telegram, setTelegram] = useState('')
  const [mattermost, setMattermost] = useState('@') // looks like 'username@https://chatserver.org'
  const [sms, setSms] = useState('')

  const doSetType = (e) => {
    const t = e.target.value
    setType(t)
    if (t === TELEGRAM_TYPE_KEY) onChange(telegram)
    else if (t === MATTERMOST_TYPE_KEY) onChange(mattermost)
    else if (t === SMS_TYPE_KEY) onChange(sms)
  }
  const updateTelegram = (e) => {
    const val = e.target.value
    setTelegram(val)
    onChange({
      type: TELEGRAM_TYPE_KEY,
      id: val
    })
  }
  const updateMattermostUsername = (e) => {
    // keep the second half
    const val = e.target.value + '@' + mattermost.split('@')[1]
    setMattermost(val)
    onChange({
      type: MATTERMOST_TYPE_KEY,
      id: val
    })
  }
  const updateMattermostChatServer = (e) => {
    // keep the first half
    const val = mattermost.split('@')[0] + '@' + e.target.value
    setMattermost(val)
    onChange({
      type: MATTERMOST_TYPE_KEY,
      id: val
    })
  }
  const updateSms = (e) => {
    const val = e.target.value
    setSms(val)
    onChange({
      type: SMS_TYPE_KEY,
      id: val
    })
  }
  const clickRemove = (e) => {
    e.preventDefault()
    onRemove()
  }

  return <div className="contactable-input">
    <input type="text" placeholder="Harry Potter"></input>
    <select onChange={doSetType}>
      <option value="telegram">Telegram</option>
      <option value="sms">SMS</option>
      <option value="mattermost">Mattermost</option>
    </select>
    {type === SMS_TYPE_KEY && <input type="text" name="sms-number" placeholder="+12223334444" value={sms} onChange={updateSms} />}
    {type === MATTERMOST_TYPE_KEY && <>
      <input type="text" name="mattermost-username" value={mattermost.split('@')[0]} onChange={updateMattermostUsername} placeholder="username" />
      <input type="text" name="mattermost-chat-server"
        placeholder="https://chat.server.org" value={mattermost.split('@')[1]} onChange={updateMattermostChatServer} />
    </>}
    {type === TELEGRAM_TYPE_KEY && <input type="text" name="telegram-username" value={telegram} onChange={updateTelegram}  placeholder="username" />}
    {showRemove && <button onClick={clickRemove}>Remove</button>}
  </div>
}