import React, { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { toast, Toaster } from 'react-hot-toast'

import { mainUrl } from "../../../config.json"
import AuthContext from './../../context/AuthContext'
import { get, post } from '../../utility'
import Alert from '../../components/Alert/Alert'
import PortalModal from '../../components/PortalModal/PortalModal'

function UserOrders() {
  const authContext = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [modal, setModal] = useState({ show: false, order: {} })

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
        toast.error(err.response.data.err)
      })
  }

  return (
    <>
      <div className='w-full flex flex-col justify-center items-center gap-6'>
        {
          orders.length > 0 && orders.map(order => {
            if (order.status === 'pending') {
              return (
                <div key={order.id}
                  className={`bg-blue-200 w-full flex flex-col justify-center items-center gap-3
                    rounded-xl p-3`}>
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
                    {
                      order.adminMessage && (
                        <li className={`border-blue-300 border-t-2 border-dashed w-full
                          flex gap-3 p-3`}>
                          <span className='sansbold'>پیام پشتیبانی:</span>
                          <p className='text-sm'>{order.adminMessage}</p>
                        </li>
                      )
                    }
                  </ul>
                  <button className='badge-btn badge-danger px-6'
                    onClick={() => deleteOrder(order.id)}>لغو سفارش</button>
                </div>
              )
            }
            else if (order.status === 'working') {
              return (
                <div key={order.id}
                  className={`bg-yellow-200 w-full flex flex-col justify-center items-center gap-3
                    rounded-xl p-3`}>
                  <div className={`bg-yellow-300 flex justify-center items-center gap-3 px-9 py-2
                    rounded-full relative shadow-sm shadow-yellow-500`}>
                    <span>کد سفارش:</span>
                    <span>{order.id} #</span>
                    <div className={`bg-yellow-500 text-white w-3/4 text-center text-xs
                      p-0.5 rounded-b-full
                      absolute top-full shadow-sm shadow-yellow-700`}>
                      {order.status === 'pending' ? 'در انتظار تایید' : 'در حال انجام'}
                    </div>
                  </div>
                  <ul className='w-full flex flex-col mt-6'>
                    <li className={`border-yellow-300 border-t-2 border-dashed w-full
                      flex justify-center items-center gap-3 p-3`}>
                      <span className='sansbold'>نام دستگاه: </span>
                      <span className='text-sm'>{order.phoneName}</span>
                      <span>-</span>
                      <span className='sansbold'>قطعات:</span>
                      <span className='text-sm'>{order.partName}</span>
                    </li>
                    <li className={`border-yellow-300 border-t-2 border-dashed w-full
                      flex gap-3 p-3`}>
                      <span className='sansbold'>آدرس:</span>
                      <p className='text-sm'>{order.address}</p>
                    </li>
                    <li className={`border-yellow-300 border-t-2 border-dashed w-full
                      flex gap-3 p-3`}>
                      <span className='sansbold'>توضیحات:</span>
                      <p className='text-sm'>{order.description}</p>
                    </li>
                    {
                      order.adminMessage && (
                        <li className={`border-yellow-300 border-t-2 border-dashed w-full
                          flex gap-3 p-3`}>
                          <span className='sansbold'>پیام پشتیبانی:</span>
                          <p className='text-sm'>{order.adminMessage}</p>
                        </li>
                      )
                    }
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
              <div className="w-full overflow-x-auto rounded-xl">
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
                            <tr
                              key={order.id}
                              className='tbody__tr cursor-pointer'
                              onClick={() => setModal({ show: true, order })}
                            >
                              <td className='tbody__tr__td w-2/12'>
                                <div className='td__wrapper justify-center'>
                                  {
                                    order.status === 'done' ? (
                                      <button className='badge badge-success select-text'>{order.id} #</button>
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
                              <td className='tbody__tr__td w-2/12 text-sm'>
                                {
                                  order.total ? (
                                    <>
                                      39,000,000
                                      <small className='italic opacity-75 mx-1'>تومان</small>
                                    </>
                                  ) : '-'
                                }
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
              </div>
            )
          )
        }
        <Toaster />
      </div >

      {
        modal.show && createPortal(
          <PortalModal closeHandler={() => setModal({ show: false, order: {} })}>
            <ul className="w-96 max-h-[80vh] overflow-y-scroll rounded-md">
              <li className='w-full flex justify-center items-center rounded-md'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  کد سفارش
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {modal.order.id} #
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  وضعیت
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {
                    modal.order.status === 'pending' ? 'در انتظار تعمیر'
                      : modal.order.status === 'working' ? 'تایید شده'
                        : modal.order.status === 'cancelled' ? 'لغو شده'
                          : modal.order.status === 'done' ? 'انجام شده'
                            : ''
                  }
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  تعمیر کننده
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {
                    modal.order.repairMan ?
                      `${modal.order.repairMan.firstName} ${modal.order.repairMan.firstName}`
                      : '-'
                  }
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  دستگاه
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {modal.order.phoneName}
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  قطعه
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {modal.order.partName}
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  تاریخ
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {new Date(modal.order.createdAt).toLocaleDateString('fa-IR')}
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  قیمت
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {
                    modal.order.total ? (
                      <>
                        {modal.order.total}
                        <small className='italic opacity-75 mx-1'>تومان</small>
                      </>
                    ) : '-'
                  }
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  تصویر
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  <a
                    className='underline'
                    href={`${mainUrl}/uploads/${modal.order.picture}`}
                    target='_blank'
                  >مشاهده</a>
                </div>
              </li>

              {
                modal.order.adminMessage && (
                  <li className='w-full flex flex-col justify-center items-center rounded-md mt-1'>
                    <div className="bg-blue-100 text-blue-500 w-full p-3 rounded-t-md text-center">
                      پیام پشتیبانی
                    </div>
                    <div className="bg-white w-full flex justify-center items-center p-3 rounded-b-md
                      text-center break-all">
                      {modal.order.adminMessage}
                    </div>
                  </li>
                )
              }

              <li className='w-full flex flex-col justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-full p-3 rounded-t-md text-center">
                  آدرس
                </div>
                <div className="bg-white w-full flex justify-center items-center p-3 rounded-b-md
                  text-center break-all">
                  {modal.order.address}
                </div>
              </li>

              <li className='w-full flex flex-col justify-center items-center rounded-md mt-1 '>
                <div className="bg-blue-100 text-blue-500 w-full p-3 rounded-t-md text-center">
                  توضیحات
                </div>
                <div className="bg-white w-full flex justify-center items-center p-3 rounded-b-md
                  text-center break-all">
                  {modal.order.description}
                </div>
              </li>
            </ul>
          </PortalModal>,
          document.body
        )
      }
    </>
  )
}

export default UserOrders