import React, { useState, useEffect } from 'react'
import moment from 'moment'

export default function SecondCountdown({ seconds, over }) {
  const [liveSeconds, updateLiveSeconds] = useState(seconds)
  // only setup on initialize
  useEffect(() => {
    const id = setInterval(() => {
      updateLiveSeconds(liveSeconds => {
        const newVal = liveSeconds - 1
        if (newVal === 0) {
          over()
          clearInterval(id)
        }
        return newVal
      })
    }, 1000)
    // clearInterval at teardown
    return () => clearInterval(id)
  }, [])
  return <span>{moment.duration(liveSeconds, 'seconds').humanize()}</span>
}
