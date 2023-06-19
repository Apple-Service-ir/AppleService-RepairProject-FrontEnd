import React from 'react'

import Loader from '../Loader/Loader'

function SubmitBtn(props) {
  const { children, customClass, isLoading, clickHandler } = props

  return (
    <button
      className={`btn btn-blue ${customClass} ${isLoading && 'cursor-default'}`}
      onClick={clickHandler}
      disabled={isLoading}
    >
      {
        isLoading ? <Loader color={'bg-white'} /> : children
      }
    </button>
  )
}

export default SubmitBtn