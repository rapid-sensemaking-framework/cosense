import React from 'react'
import './RegisterTypesConfig.css'

export default function RegisterTypesConfig({ types, onChange }) {
  return <>
    <div className='input-label'>Apps</div>
    <div className='input-help-label'>
      Select which apps participants will be allowed to register with
    </div>
    <div className="register-types">
      {Object.keys(types).map(type => {
        return <div className="register-type" key={type}>
          <input type="checkbox" id={type} checked={types[type]} onChange={() => onChange({...types, [type]: !types[type]})}></input>
          <label htmlFor={type}>{type}</label>
        </div>
      })}
    </div>
  </>
}