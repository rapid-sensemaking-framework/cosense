import React, { useState, useEffect } from 'react'
import { TYPE_KEY as SMS_TYPE_KEY } from 'rsf-smsable'
import { TYPE_KEY as TELEGRAM_TYPE_KEY } from 'rsf-telegramable'
import { TYPE_KEY as MATTERMOST_TYPE_KEY } from 'rsf-mattermostable'

import './ContactableInput.css'

export default function ContactableInput({ contactable, onChange, showRemove, onRemove }) {
  const [type, setType] = useState(contactable.type || 'telegram')
  const [name, setName] = useState(contactable.name || '')
  const [telegram, setTelegram] = useState(contactable.type === TELEGRAM_TYPE_KEY ? contactable.id : '')
  const [mattermost, setMattermost] = useState(contactable.type === MATTERMOST_TYPE_KEY ? contactable.id : '@') // looks like 'username@https://chatserver.org'
  const [sms, setSms] = useState(contactable.type === SMS_TYPE_KEY ? contactable.id : '')

  useEffect(() => {
    const id = type === TELEGRAM_TYPE_KEY
      ? telegram
      : type === MATTERMOST_TYPE_KEY
      ? mattermost
      : sms
    onChange({
      type,
      id,
      name
    })
  }, [type, name, telegram, mattermost, sms])

  const doSetType = (e) => {
    const t = e.target.value
    setType(t)
  }
  const updateTelegram = (e) => {
    const val = e.target.value
    setTelegram(val)
  }
  const updateMattermostUsername = (e) => {
    // keep the second half
    const val = e.target.value + '@' + mattermost.split('@')[1]
    setMattermost(val)
  }
  const updateMattermostChatServer = (e) => {
    // keep the first half
    const val = mattermost.split('@')[0] + '@' + e.target.value
    setMattermost(val)
  }
  const updateSms = (e) => {
    const val = e.target.value
    setSms(val)
  }
  const clickRemove = (e) => {
    e.preventDefault()
    onRemove()
  }

  return <div className="contactable-input">
    <input type="text" placeholder="Harry Potter" value={name} onChange={(e) => setName(e.target.value)}></input>
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
    {showRemove && <button className="button" onClick={clickRemove}>Remove</button>}
  </div>
}