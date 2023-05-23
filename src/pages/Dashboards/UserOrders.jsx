import React from 'react'

function UserOrders() {
  return (
    <div className='w-full flex flex-col justify-center items-center gap-6'>

      <div className="bg-green-200 w-full flex flex-col justify-center items-center gap-3 rounded-xl p-3">
        <div className="bg-green-300 flex justify-center items-center gap-3 px-9 py-2
        rounded-full relative shadow-sm shadow-green-500">
          <span>کد سفارش:</span>
          <button className='flex justify-center items-center relative group'>
            <span>#20139</span>
            <span className='tooltip'>کپی کنید!</span>
          </button>
          <div className="bg-green-500 text-white w-3/4 text-center text-xs p-0.5 rounded-b-full
          absolute top-full shadow-sm shadow-green-700">وضعیت: در حال انتظار</div>
        </div>
        <ul className='w-full flex flex-col mt-6'>
          <li className='border-green-300 border-t-2 border-dashed w-full
          flex justify-center items-center gap-3 p-3'>
            <span className='sansbold'>نام دستگاه: </span>
            <span className='text-sm'>samsung s20 plus</span>
            <span>-</span>
            <span className='sansbold'>قطعات:</span>
            <span className='text-sm'>LCD</span>
            <span className='text-sm'>دوربین پشت</span>
            <span className='text-sm'>باتری</span>
          </li>
          <li className='border-green-300 border-t-2 border-dashed w-full
          flex gap-3 p-3'>
            <span className='sansbold'>آدرس:</span>
            <p className='text-sm'>
              لورم ایپسوم متن ساختگی با از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متنوع.
            </p>
          </li>
          <li className='border-green-300 border-t-2 border-dashed w-full
          flex gap-3 p-3'>
            <span className='sansbold'>توضیحات:</span>
            <p className='text-sm'>
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع.
            </p>
          </li>
        </ul>
        <button className='badge-btn badge-danger px-6'>لفو سفارش</button>
      </div>

      <h2 className='w-full text-xl text-right sansbold'>لیست سفارشات انجام شده</h2>
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
              <td className='w-3/12 p-3'>Iphone 13</td>
              <td className='w-4/12 p-3'>
                <div className="w-full flex items-center gap-3">
                  <span>LCD</span>
                  <span>سوکت شارژ</span>
                  <span>دوربین جلو</span>
                </div>
              </td>
              <td className='w-3/12 p-3'>شایان نصر آبادی</td>
              <td className='w-2/12 p-3'>
                <button className='badge-btn badge-blue relative group'>
                  <span>20314</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                  </svg>
                  <span className='tooltip'>کپی کنید!</span>
                </button>
              </td>
            </tr>
            <tr className='border-blue-200 border-b border-dashed w-full'>
              <td className='w-3/12 p-3'>Iphone 13</td>
              <td className='w-4/12 p-3'>
                <div className="w-full flex items-center gap-3">
                  <span>LCD</span>
                  <span>سوکت شارژ</span>
                  <span>دوربین جلو</span>
                </div>
              </td>
              <td className='w-3/12 p-3'>شایان نصر آبادی</td>
              <td className='w-2/12 p-3'>
                <button className='badge-btn badge-danger relative group'>
                  <span>33065</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className='tooltip'>لفو شده</span>
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