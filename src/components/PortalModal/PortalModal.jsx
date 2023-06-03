import React from 'react'

function PortalModal({ children, closeHandler }) {
  return (
    <div className='bg-black bg-opacity-25 backdrop-blur-sm
      w-screen h-screen flex justify-center items-center overflow-hidden fixed top-0 left-0 z-50 show-modal'>
      <button
        className='bg-red-500 w-6 h-6 flex justify-center items-center rounded-full
        absolute top-3 right-3'
        onClick={closeHandler}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="stroke-white w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {children}
    </div>
  )
}

export default PortalModal