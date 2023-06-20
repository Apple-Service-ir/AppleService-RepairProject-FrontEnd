import React from 'react'

import Loader from '../Loader/Loader'

function SubmitBtn(props) {
  const { children, customClass, isLoading, clickHandler, type } = props

  return (
    <button
      className={`btn ${type === 'danger' ? 'btn-danger' : 'btn-blue'}
        ${customClass} ${isLoading && 'cursor-default'}`}
      onClick={clickHandler}
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