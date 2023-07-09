import React from 'react'

function TransActionBox({ status }) {
  return (
    <div className='w-[600px] flex flex-col justify-center items-center'>
      <h1 className={`${status ? 'text-green-500' : 'text-red-500'} sansbold text-3xl`}>
        {
          status ? 'پرداخت با موفقیت انجام شد' : 'متاسفانه مشکلی پیش آمد'
        }
      </h1>
      <div className={`${status ? 'bg-green-200' : 'bg-red-200'} bg-blue-200 w-full
        p-9 pt-16 mt-20 rounded-xl relative`}>
        <div className={`${status ? 'bg-green-500' : 'bg-red-500'}
          w-24 h-24 flex justify-center items-center rounded-full
          absolute -top-12 left-1/2 -translate-x-1/2`}>
          {
            status ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )
          }
        </div>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis, animi!</p>
      </div>
    </div>
  )
}

export default TransActionBox