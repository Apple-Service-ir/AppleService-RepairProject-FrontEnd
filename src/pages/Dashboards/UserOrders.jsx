import React from 'react'

function UserOrders() {
  return (
    <div className='w-full flex flex-col justify-center items-center gap-6'>

      <div className="w-full">
        <div className="bg-blue-200 w-full h-12 flex justify-between items-center p-6 rounded-t-xl">
          <div className="h-full flex justify-center items-center gap-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-blue-500 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
            </svg>
            <div className='text-blue-500 flex justify-center items-center gap-2'>
              <span className='sansbold'>کد سفارش:</span>
              <span className='text-gray-500 cursor-pointer text-sm'>#1935402</span>
            </div>
          </div>
          <button className='badge badge-blue'>در انتطار تایید</button>
          {/* <button className='badge badge-danger cursor-pointer'>لغو سفارش</button> */}
        </div>
        <div className="border-blue-200 border-2 border-dashed border-t-0 w-full
        flex flex-col justify-center items-center p-6 rounded-b-xl">

        </div>
      </div>

    </div>
  )
}

export default UserOrders