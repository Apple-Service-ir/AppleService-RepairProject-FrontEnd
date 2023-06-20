import React from 'react'

function Loader({ size, before }) {
  return (
    <div className={`dot-spinner ${size}`}>
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