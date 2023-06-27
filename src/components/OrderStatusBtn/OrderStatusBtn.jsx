import React from 'react'

import Loader from '../Loader/Loader'

function OrderStatusBtn(props) {
  const { customStyles, status, children, clickHandler, isLoading } = props

  let btnStyles = ''
  let loaderBefore = ''
  switch (status) {
    case 'done': {
      btnStyles = 'text-green-500 hover:bg-green-500'
      loaderBefore = 'before:bg-green-400'
      break;
    }

    case 'working': {
      btnStyles = 'text-yellow-500 hover:bg-yellow-500'
      loaderBefore = 'before:bg-yellow-400'
      break;
    }

    case 'cancelled': {
      btnStyles = 'text-red-500 hover:bg-red-500'
      loaderBefore = 'before:bg-red-400'
      break;
    }

    default: {
      break;
    }
  }

  return (
    <button
      className={`${btnStyles} bg-white w-1/3 h-12 text-sm py-2 px-6 rounded-md
        flex justify-center items-center
        hover:text-white ${isLoading && 'cursor-default'} ${customStyles}`}
      onClick={clickHandler}
      disabled={isLoading}
    >
      {
        isLoading ? <Loader size={'w-5 h-5'} before={loaderBefore} /> : children
      }
    </button>
  )
}

export default OrderStatusBtn