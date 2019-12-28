import React from 'react'
import './Modal.css'

export default function Modal({ cancel, children }) {
  return (
    <div className='modal-backdrop'>
      <div className='modal-content'>
        <div onClick={cancel} className='modal-cancel'>
          &#215;
        </div>
        {children}
      </div>
    </div>
  )
}
