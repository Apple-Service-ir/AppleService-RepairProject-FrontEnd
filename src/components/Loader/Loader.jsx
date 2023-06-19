import React from 'react'

function Loader({ before }) {
  return (
    <div className="dot-spinner">
      <div className={`dot-spinner__dot ${before}`}></div>
      <div className={`dot-spinner__dot ${before}`}></div>
      <div className={`dot-spinner__dot ${before}`}></div>
      <div className={`dot-spinner__dot ${before}`}></div>
      <div className={`dot-spinner__dot ${before}`}></div>
      <div className={`dot-spinner__dot ${before}`}></div>
      <div className={`dot-spinner__dot ${before}`}></div>
      <div className={`dot-spinner__dot ${before}`}></div>
    </div>
  )
}

export default Loader