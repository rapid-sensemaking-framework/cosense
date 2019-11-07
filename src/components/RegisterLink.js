import React, { useState } from 'react'
import SecondCountdown from '../components/SecondCountdown'
import { getElectron } from '../electron-require'
const { shell } = getElectron()

export default function RegisterLink({ timeLeft, url }) {
  const [over, setOver] = useState(timeLeft === 0)
  const onClickLink = (e) => {
    e.preventDefault()
    shell.openExternal(url)
  }
  return <>
    {!over && <>
      <p>Registration will remain open for another <SecondCountdown seconds={timeLeft} over={() => setOver(true)} /> seconds.</p>
      <div>Link to share</div>
      <a className="float-right" href={ url } onClick={onClickLink}>preview</a>
      <input type="text" readOnly value={ url }></input>
    </>}
    {over && <p>Registration is now closed.</p>}
  </>
}