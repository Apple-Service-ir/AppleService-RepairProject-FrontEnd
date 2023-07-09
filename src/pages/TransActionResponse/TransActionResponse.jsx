import React from 'react'
import TransActionBox from '../../components/TransActionBox/TransActionBox'

function TransActionResponse() {
  return (
    <div className='w-screen h-screen'>
      <div className="w-full h-16 flex justify-center items-end">
        <a
          className='btn btn-blue'
          href="/"
        >
          یازگشت به سایت
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
          </svg>
        </a>
      </div>
      <div className="current-screen-height flex justify-center items-center">
        <TransActionBox status={false} />
      </div>
    </div>
  )
}

export default TransActionResponse