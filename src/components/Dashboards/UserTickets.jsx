import React from 'react'
import Alert from '../Alert/Alert'

function UserTickets() {
  return (
    <div className='w-full flex flex-col justify-center items-center gap-6'>
      <div className="border-2 border-blue-200 border-dashed w-full rounded-xl flex justify-between items-center p-3">
        <p className='text-blue-500 text-sm'>
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است
        </p>
        <button className='btn btn-blue'>ثبت تیکت جدید</button>
      </div>

      <Alert
        theme={'danger'}
        title={'شما هیچ تیکتی ندارید!'}
        icon={(
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        )}
      />

      <h2 className='w-full text-right text-xl sansbold'>لیست تیکت ها</h2>
      <div className="w-full rounded-xl overflow-x-scroll
        lg:overflow-hidden">
        <table className='table'>
          <thead className='thead'>
            <tr className='thead__tr'>
              <th className='thead__tr__th w-2/12'>کد تیکت</th>
              <th className='thead__tr__th w-2/12'>وضعیت</th>
              <th className='thead__tr__th w-6/12'>موضوع تیکت</th>
              <th className='thead__tr__th w-2/12'>تاریخ</th>
            </tr>
          </thead>
          <tbody className='tbody'>
            <tr className='tbody__tr cursor-pointer'>
              <td className='tbody__tr__td w-2/12'>
                <div className='w-full flex flex-wrap items-center gap-3 justify-center'>
                  <button className='badge badge-blue select-text'>
                    <span>30212</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                    </svg>
                  </button>
                </div>
              </td>
              <td className='tbody__tr__td w-2/12'>
                <div className="td__wrapper">
                  <span className='text-xs'>پاسخ داده شده</span>
                </div>
              </td>
              <td className='tbody__tr__td w-6/12 text-sm'>چگونه سفارش ثبت کنم؟</td>
              <td className='tbody__tr__td w-2/12 text-sm'>12/2/1440</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserTickets