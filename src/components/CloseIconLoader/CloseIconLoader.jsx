import React from 'react'

import Loader from '../Loader/Loader'

function CloseIconLoader({ customClass, isLoading, clickHandler }) {
  return (
    <button
      className={`${customClass} text-red-500 w-5 h-5`}
      onClick={clickHandler}
    >
      {
        isLoading ? <Loader size={'w-5 h-5'} before={'before:bg-red-500'} /> : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            className='w-5 h-5'>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      }
    </button>
  )
}

export default CloseIconLoader