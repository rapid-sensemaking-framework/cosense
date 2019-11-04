import React, { useState, useEffect } from 'react'

export default function RegisterConfig({ expectedInput, onChange }) {
  const facilChoiceString = 'facil_register'
  const publicChoiceString = 'public_choice'
  const [configChoice, setConfigChoice] = useState(facilChoiceString)
  const { process } = expectedInput

  const facilRegisterIdent = `${process}-check-facil_register`
  const checkPublicLinkIdent = `${process}-check-public_link`
  const processContextIdent = `${process}-ParticipantRegister-process_context`
  const maxTimeIdent = `${process}-ParticipantRegister-max_time`
  const maxParticipantsIdent = `${process}-ParticipantRegister-max_participants`

  const pickFacilRegister = () => {
    setConfigChoice(facilChoiceString)
    onChange(facilRegisterIdent, facilChoiceString)
    onChange(checkPublicLinkIdent, '')
  }
  const pickPublicLink = () => {
    setConfigChoice(publicChoiceString)
    onChange(checkPublicLinkIdent, publicChoiceString)
    onChange(facilRegisterIdent, '')
  }

  useEffect(() => {
    // set default for parent
    onChange(facilRegisterIdent, facilChoiceString)
  }, []) // only occurs on initialize

  return <div id={`${process}_ParticipantRegister`}>
    <input type="radio" value={facilChoiceString} id={facilRegisterIdent} name={facilRegisterIdent}
      checked={configChoice === facilChoiceString} onChange={pickFacilRegister}/>
    <label className="label-inline" htmlFor={facilRegisterIdent}>
      Configure participant list myself
    </label>
    <br />
    <input type="radio" value="public_link" id={checkPublicLinkIdent} name={checkPublicLinkIdent}
      checked={configChoice === publicChoiceString} onChange={pickPublicLink} />
    <label className="label-inline" htmlFor={checkPublicLinkIdent}>
      Allow participants to register at a public link
    </label>
    {configChoice === publicChoiceString && <div>
      <label htmlFor={processContextIdent}>
        Provide a little bit of context to participants as
        to what they're registering for
      </label>
      <input type="text" id={processContextIdent} name={processContextIdent} onChange={(evt) => onChange(processContextIdent, evt.target.value)} />

      <label htmlFor={maxTimeIdent}>
        How many minutes would you like to leave for participant
        registration for this stage?
      </label>
      <input type="text" id={maxTimeIdent} name={maxTimeIdent} onChange={(evt) => onChange(maxTimeIdent, evt.target.value)} />

      <label htmlFor={maxParticipantsIdent}>
        What is the maximum number of participants you'd
        like to accept for this stage?
      </label>
      <input type="text" id={maxParticipantsIdent} name={maxParticipantsIdent} onChange={(evt) => onChange(maxParticipantsIdent, evt.target.value)} />
    </div>}
  </div>
}