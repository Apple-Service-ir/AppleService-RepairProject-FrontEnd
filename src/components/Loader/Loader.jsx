import React from 'react'

function Loader({ color }) {
  return (
    <div className="dot-spinner">
      <div className={`dot-spinner__dot before:${color}`}></div>
      <div className={`dot-spinner__dot before:${color}`}></div>
      <div className={`dot-spinner__dot before:${color}`}></div>
      <div className={`dot-spinner__dot before:${color}`}></div>
      <div className={`dot-spinner__dot before:${color}`}></div>
      <div className={`dot-spinner__dot before:${color}`}></div>
      <div className={`dot-spinner__dot before:${color}`}></div>
      <div className={`dot-spinner__dot before:${color}`}></div>
    </div>
  )
}

export default Loader