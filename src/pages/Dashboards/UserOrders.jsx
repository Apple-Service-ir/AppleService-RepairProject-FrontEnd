import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast, Toaster } from 'react-hot-toast'

import AuthContext from './../../context/AuthContext'
import { get, post } from '../../utility'

function UserOrders() {
  const authContext = useContext(AuthContext)
  const [orders, setOrders] = useState([])


  useEffect(() => {
    get(`/orders/log?token=${authContext.userToken}`).then((response) => {
      response.data.ok && setOrders(response.data.orders)
    })
  }, [authContext])

  function deleteOrder(orderId) {
    post('/orders/cancel', { orderId, token: authContext.userToken })
      .then(response => {
        if (response.data.ok) {
          console.log(response.data);
          setOrders(response.data.orders)
          toast.success("سفارش شما با موفقیت لغو شد")
        } else toast.error(response.data.err)
      })
  }

  return (
    <div className='w-full flex flex-col justify-center items-center gap-6'>

      {
        orders.length > 0 && orders.map(order => {
          if (order.status === 'pending') {
            return (
              <div key={order.id}
                className={`bg-blue-200 w-full flex flex-col justify-center items-center gap-3 rounded-xl p-3`}>
                <div className={`bg-blue-300 flex justify-center items-center gap-3 px-9 py-2
                rounded-full relative shadow-sm shadow-blue-500`}>
                  <span>کد سفارش:</span>
                  <button className='flex justify-center items-center relative group'>
                    <span>#{order.id}</span>
                    <span className='tooltip'>کپی کنید!</span>
                  </button>
                  <div className={`bg-blue-500 text-white w-3/4 text-center text-xs p-0.5 rounded-b-full
                  absolute top-full shadow-sm shadow-blue-700`}>
                    {order.status === 'pending' ? 'در انتظار تایید' : 'در حال انجام'}
                  </div>
                </div>
                <ul className='w-full flex flex-col mt-6'>
                  <li className={`border-blue-300 border-t-2 border-dashed w-full
                  flex justify-center items-center gap-3 p-3`}>
                    <span className='sansbold'>نام دستگاه: </span>
                    <span className='text-sm'>{order.phoneName}</span>
                    <span>-</span>
                    <span className='sansbold'>قطعات:</span>
                    <span className='text-sm'>{order.partName}</span>
                  </li>
                  <li className={`border-blue-300 border-t-2 border-dashed w-full
                  flex gap-3 p-3`}>
                    <span className='sansbold'>آدرس:</span>
                    <p className='text-sm'>{order.address}</p>
                  </li>
                  <li className={`border-blue-300 border-t-2 border-dashed w-full
                  flex gap-3 p-3`}>
                    <span className='sansbold'>توضیحات:</span>
                    <p className='text-sm'>{order.description}</p>
                  </li>
                </ul>
                <button className='badge-btn badge-danger px-6'
                  onClick={() => deleteOrder(order.id)}>لغو سفارش</button>
              </div>
            )
          }
          else if (order.status === 'working') {
            return (
              <div key={order.id}
                className={`bg-green-200 w-full flex flex-col justify-center items-center gap-3 rounded-xl p-3`}>
                <div className={`bg-green-300 flex justify-center items-center gap-3 px-9 py-2
                rounded-full relative shadow-sm shadow-green-500`}>
                  <span>کد سفارش:</span>
                  <button className='flex justify-center items-center relative group'>
                    <span>#{order.id}</span>
                    <span className='tooltip'>کپی کنید!</span>
                  </button>
                  <div className={`bg-green-500 text-white w-3/4 text-center text-xs p-0.5 rounded-b-full
                  absolute top-full shadow-sm shadow-green-700`}>
                    {order.status === 'pending' ? 'در انتظار تایید' : 'در حال انجام'}
                  </div>
                </div>
                <ul className='w-full flex flex-col mt-6'>
                  <li className={`border-green-300 border-t-2 border-dashed w-full
                  flex justify-center items-center gap-3 p-3`}>
                    <span className='sansbold'>نام دستگاه: </span>
                    <span className='text-sm'>{order.phoneName}</span>
                    <span>-</span>
                    <span className='sansbold'>قطعات:</span>
                    <span className='text-sm'>{order.partName}</span>
                  </li>
                  <li className={`border-green-300 border-t-2 border-dashed w-full
                  flex gap-3 p-3`}>
                    <span className='sansbold'>آدرس:</span>
                    <p className='text-sm'>{order.address}</p>
                  </li>
                  <li className={`border-green-300 border-t-2 border-dashed w-full
                  flex gap-3 p-3`}>
                    <span className='sansbold'>توضیحات:</span>
                    <p className='text-sm'>{order.description}</p>
                  </li>
                </ul>
              </div>
            )
          }
        })
      }

      {
        orders[0] && orders.find(order => order.status == "done" || order.status == "cancelled") && (
          <h2 className='w-full text-right text-xl sansbold'>لیست سفارشات تمام شده</h2>
        )
      }

      <div className="w-full rounded-xl overflow-hidden">
        {
          orders.length === 0 ? (
            <div className="alert-danger">
              <div className='flex justify-center items-center gap-3'>
                <h1 className='text-xl'>شما هیچ سفارشی ندارید!</h1>
                <Link to='/order' className='text-blue-500 underline text-sm'>ثبت سفارش</Link>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
          ) : (
            orders[0] && orders.find(order => order.status == "done" || order.status == "cancelled") && (
              <table className='w-full'>
                <thead className='bg-blue-200 w-full'>
                  <tr className='w-full'>
                    <th className='w-3/12 font-light text-right px-3 py-1'>نام دستگاه</th>
                    <th className='w-3/12 font-light text-right px-3 py-1'>قطعات</th>
                    <th className='w-2/12 font-light text-right px-3 py-1'>هزینه نهایی</th>
                    <th className='w-2/12 font-light text-right px-3 py-1'>تاریخ</th>
                    <th className='w-2/12 font-light text-right px-3 py-1'>کد سفارش</th>
                  </tr>
                </thead>
                <tbody className='w-full'>
                  {
                    orders.map(order => {
                      if (order.status === 'done' || order.status === "cancelled") {
                        return (
                          <tr key={order.id} className='border-blue-200 border-b border-dashed w-full'>
                            <td className='w-3/12 p-3 text-sm'>{order.phoneName}</td>
                            <td className='w-3/12 p-3'>
                              <div className="w-full flex flex-wrap items-center gap-3">
                                <span className='text-xs'>{order.partName}</span>
                              </div>
                            </td>
                            <td className='w-2/12 p-3 text-sm'>39,000,000 ﷼</td>
                            <td className='w-2/12 p-3 text-sm'>
                              {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                            </td>
                            <td className='w-2/12 p-3'>
                              {
                                order.status === 'done' ? (
                                  <button className='badge-btn badge-blue relative group'>
                                    <span>{order.id}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                                    </svg>
                                    <span className='tooltip'>انجام شده، کپی کنید!</span>
                                  </button>
                                ) : (
                                  <button className='badge-btn badge-danger relative group'>
                                    <span>{order.id}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className='tooltip'>لفو شده، کپی کنید!</span>
                                  </button>
                                )
                              }
                            </td>
                          </tr>
                        )
                      }
                    })
                  }
                </tbody>
              </table>
            )
          )
        }
      </div>
      <Toaster />
    </div >
  )
}

export default UserOrders