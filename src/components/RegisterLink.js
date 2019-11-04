import React, { useState } from 'react'
import SecondCountdown from '../components/SecondCountdown'

export default function RegisterLink({ timeLeft, url }) {
  const [over, setOver] = useState(timeLeft === 0)
  return <div>
    {!over && <div>
      <p>Registration will remain open for another <SecondCountdown seconds={timeLeft} over={() => setOver(true)} /> seconds.</p>
      <div>Link to share</div>
      <a className="float-right" target="_blank" href={ url }>preview</a>
      <input type="text" readOnly value={ url }></input>
    </div>}
    {over && <p>Registration is now closed.</p>}
  </div>
}