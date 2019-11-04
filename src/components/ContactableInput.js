import React, { useState } from 'react'

export default function ContactableInput({ onChange, showRemove, onRemove }) {
  const [type, setType] = useState('telegram')
  const [telegram, setTelegram] = useState('')
  const [mattermost, setMattermost] = useState('@') // looks like 'username@https://chatserver.org'
  const [phone, setPhone] = useState('')

  const doSetType = (e) => {
    const t = e.target.value
    setType(t)
    if (t === 'telegram') onChange(telegram)
    else if (t === 'mattermost') onChange(mattermost)
    else if (t === 'phone') onChange(phone)
  }
  const updateTelegram = (e) => {
    const val = e.target.value
    setTelegram(val)
    onChange({
      type: 'telegram',
      id: val
    })
  }
  const updateMattermostUsername = (e) => {
    // keep the second half
    const val = e.target.value + '@' + mattermost.split('@')[1]
    setMattermost(val)
    onChange({
      type: 'mattermost',
      id: val
    })
  }
  const updateMattermostChatServer = (e) => {
    // keep the first half
    const val = mattermost.split('@')[0] + '@' + e.target.value
    setMattermost(val)
    onChange({
      type: 'mattermost',
      id: val
    })
  }
  const updatePhone = (e) => {
    const val = e.target.value
    setPhone(val)
    onChange({
      type: 'phone',
      id: val
    })
  }
  const clickRemove = (e) => {
    e.preventDefault()
    onRemove()
  }

  return <div>
    <div>
      <label htmlFor="type">Contact Type</label>
      <select onChange={doSetType}>
        <option value="telegram">Telegram</option>
        <option value="phone">Phone</option>
        <option value="mattermost">Mattermost</option>
      </select>
    </div>
    {type === 'phone' && <div>
      <label htmlFor="phone-number">Number</label>
      <input type="text" name="phone-number" placeholder="+12223334444" value={phone} onChange={updatePhone} />
    </div>}
    {type === 'mattermost' && <div>
      <label htmlFor="mattermost-username">Username</label>
      <input type="text" name="mattermost-username" value={mattermost.split('@')[0]} onChange={updateMattermostUsername} />
      <label htmlFor="mattermost-chat-server">Chat Server URL</label>
      <input type="text" name="mattermost-chat-server"
        placeholder="https://chat.server.org" value={mattermost.split('@')[1]} onChange={updateMattermostChatServer} />
    </div>}
    {type === 'telegram' && <div>
      <label htmlFor="telegram-username">Username</label>
      <input type="text" name="telegram-username" autoFocus value={telegram} onChange={updateTelegram} />
    </div>}
    {showRemove && <button className="button button-clear" onClick={clickRemove}>Remove</button>}
  </div>
}

/*

	function clearAndSetupContactableFormListeners() {
		// handle the onchange events for the 'type' select field
		// toggling the display of particular form fields associated
		// with that type
		document.querySelectorAll('.type').forEach(node => {
			const cb = (event) => {
				// the type from the option value
				const type = event.target.value
				// hide all the other type form fields
				const contactableFormWrapper = node.parentNode.parentNode
				const nodes = contactableFormWrapper.querySelectorAll('.contactable-type')
				nodes.forEach(n => {
					n.classList.remove('show')
				})
				// show the form field for the selected type
				contactableFormWrapper.querySelector(`.${type}`).classList.add('show')
				// reset value
				contactableFormWrapper.querySelector('.id').value = ''
			}
			node.removeEventListener('change', cb)
			node.addEventListener('change', cb)
		})

		// bind mattermost fields event listeners
		// to update the hidden id field
		function updateIdForMattermost(event) {
			const node = event.target
			const contactableFormWrapper = node.parentNode.parentNode
			const username = contactableFormWrapper.querySelector('.mattermost-username').value
			const chatServer = contactableFormWrapper.querySelector('.mattermost-chat-server').value
			contactableFormWrapper.querySelector('.id').value = `${username}@${chatServer}`
		}
		document.querySelectorAll('.mattermost-username').forEach(n => {
			n.onkeyup = updateIdForMattermost
			n.onchange = updateIdForMattermost
		})
		document.querySelectorAll('.mattermost-chat-server').forEach(n => {
			n.onkeyup = updateIdForMattermost
			n.onchange = updateIdForMattermost
		})

		function updateIdForTelegram(event) {
			const node = event.target
			const contactableFormWrapper = node.parentNode.parentNode
			const value = contactableFormWrapper.querySelector('.telegram-username').value
			contactableFormWrapper.querySelector('.id').value = value
		}
		document.querySelectorAll('.telegram-username').forEach(n => {
			n.onkeyup = updateIdForTelegram
			n.onchange = updateIdForTelegram
		})

		function updateIdForPhone(event) {
			const node = event.target
			const contactableFormWrapper = node.parentNode.parentNode
			const value = contactableFormWrapper.querySelector('.phone-number').value
			contactableFormWrapper.querySelector('.id').value = value
		}
		document.querySelectorAll('.phone-number').forEach(n => {
			n.onkeyup = updateIdForPhone
			n.onchange = updateIdForPhone
		})
	}
*/