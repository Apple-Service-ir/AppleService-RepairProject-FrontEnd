import React, { useContext, useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

import AuthContext from './../../context/AuthContext'
import { get, post } from '../../utility'
import Alert from '../../components/Alert/Alert'

function UserOrders() {
  const authContext = useContext(AuthContext)
  const [orders, setOrders] = useState([])


  useEffect(() => {
    authContext.userToken &&
      get(`/orders/log?token=${authContext.userToken}`).then((response) => {
        setOrders(response.data.orders)
      })
  }, [authContext])

  function deleteOrder(orderId) {
    post('/orders/cancel', { orderId, token: authContext.userToken })
      .then(response => {
        setOrders(response.data.orders)
        toast.success("سفارش شما با موفقیت لغو شد")
      }).catch((err) => {
        toast.error(err.data.err)
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
                  <ul className={`border-blue-300 border-t-2 border-dashed w-full
                    flex flex-col justify-center items-start gap-3 p-3
                    sm:flex-row sm:items-center`}>
                    <li className='flex justify-center items-center gap-3'>
                      <span className='sansbold'>نام دستگاه: </span>
                      <span className='text-sm'>{order.phoneName}</span>
                    </li>
                    <span className='hidden sm:block'>-</span>
                    <li className='flex justify-center items-center gap-3'>
                      <span className='sansbold'>قطعات:</span>
                      <span className='text-sm'>{order.partName}</span>
                    </li>
                  </ul>
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

      <div className="w-full rounded-xl overflow-x-scroll
        lg:overflow-hidden">
        {
          orders.length === 0 ? (
            <Alert
              theme={'danger'}
              title={'شما هیچ سفارشی ندارید!'}
              link={'/order'}
              linkTitle={'ثبت سفارش'}
              icon={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
            />
          ) : (
            orders[0] && orders.find(order => order.status == "done" || order.status == "cancelled") && (
              <table className='table'>
                <thead className='thead'>
                  <tr className='thead__tr'>
                    <th className='thead__tr__th w-2/12'>کد سفارش</th>
                    <th className='thead__tr__th w-3/12'>نام دستگاه</th>
                    <th className='thead__tr__th w-3/12'>قطعات</th>
                    <th className='thead__tr__th w-2/12'>هزینه نهایی</th>
                    <th className='thead__tr__th w-2/12'>تاریخ</th>
                  </tr>
                </thead>
                <tbody className='tbody'>
                  {
                    orders.map(order => {
                      if (order.status === 'done' || order.status === "cancelled") {
                        return (
                          <tr key={order.id} className='tbody__tr'>
                            <td className='tbody__tr__td w-2/12'>
                              <div className='w-full flex flex-wrap items-center gap-3 justify-center'>
                                {
                                  order.status === 'done' ? (
                                    <button className='badge badge-blue select-text'>{order.id} #</button>
                                  ) : (
                                    <button className='badge badge-danger select-text'>{order.id} #</button>
                                  )
                                }
                              </div>
                            </td>
                            <td className='tbody__tr__td w-3/12 text-sm'>{order.phoneName}</td>
                            <td className='tbody__tr__td w-3/12'>
                              <div className="td__wrapper">
                                <span className='text-xs'>{order.partName}</span>
                              </div>
                            </td>
                            <td className='tbody__tr__td w-2/12 text-sm'>39,000,000
                              <small className='italic opacity-75 mx-1'>تومان</small>
                            </td>
                            <td className='tbody__tr__td w-2/12 text-sm'>
                              {new Date(order.createdAt).toLocaleDateString('fa-IR')}
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