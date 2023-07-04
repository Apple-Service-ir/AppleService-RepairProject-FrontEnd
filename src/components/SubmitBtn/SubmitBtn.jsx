import React from 'react'

import Loader from '../Loader/Loader'

function SubmitBtn(props) {
  const { children, customClass, isLoading, clickHandler, type } = props

  return (
    <button
      className={`btn ${type === 'danger' ? 'btn-danger' : type === 'outline' ? 'btn-out-blue' : 'btn-blue'}
        ${customClass} ${isLoading && 'cursor-default'}`}
      onClick={event => clickHandler(event)}
      disabled={isLoading}
      type='submit'
    >
      {
        isLoading ? <Loader size={'w-7 h-7'} before={'before:bg-white'} /> : children
      }
    </button>
  )
}

export default SubmitBtn