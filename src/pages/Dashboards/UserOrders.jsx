import React from 'react'

function UserOrders() {
  return (
    <div className='w-full flex flex-col justify-center items-center gap-6'>

      <div className="w-full rounded-xl overflow-hidden">
        <table className='w-full'>
          <thead className='bg-blue-200 w-full'>
            <tr className='w-full'>
              <th className='w-3/12 font-light text-right px-3 py-1'>نام دستگاه</th>
              <th className='w-4/12 font-light text-right px-3 py-1'>قطعات</th>
              <th className='w-3/12 font-light text-right px-3 py-1'>تعمیر کار</th>
              <th className='w-2/12 font-light text-right px-3 py-1'>کد سفارش</th>
            </tr>
          </thead>
          <tbody className='w-full'>
            <tr className='border-blue-200 border-b border-dashed w-full'>
              <td className='w-2/12 p-3'>Iphone 13</td>
              <td className='w-4/12 p-3'>
                <div className="w-full flex items-center gap-3">
                  <span>LCD</span>
                  <span>سوکت شارژ</span>
                  <span>دوربین جلو</span>
                </div>
              </td>
              <td className='w-2/12 p-3'>
                <button className='text-blue-500 underline decoration-blue-300'>شایان نصر آبادی</button>
              </td>
              <td className='w-2/12 p-3'>
                <button className='badge-btn badge-blue'>
                  <span>20314</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr className='border-blue-200 border-b border-dashed w-full'>
              <td className='w-2/12 p-3'>Iphone 13</td>
              <td className='w-4/12 p-3'>
                <div className="w-full flex items-center gap-3">
                  <span>LCD</span>
                  <span>سوکت شارژ</span>
                  <span>دوربین جلو</span>
                </div>
              </td>
              <td className='w-2/12 p-3'>
                <button className='text-blue-500 underline decoration-blue-300'>شایان نصر آبادی</button>
              </td>
              <td className='w-2/12 p-3'>
                <button className='badge-btn badge-blue'>
                  <span>20314</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr className='border-blue-200 border-b border-dashed w-full'>
              <td className='w-2/12 p-3'>Iphone 13</td>
              <td className='w-4/12 p-3'>
                <div className="w-full flex items-center gap-3">
                  <span>LCD</span>
                  <span>سوکت شارژ</span>
                  <span>دوربین جلو</span>
                </div>
              </td>
              <td className='w-2/12 p-3'>
                <button className='text-blue-500 underline decoration-blue-300'>شایان نصر آبادی</button>
              </td>
              <td className='w-2/12 p-3'>
                <button className='badge-btn badge-blue'>
                  <span>20314</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default UserOrders