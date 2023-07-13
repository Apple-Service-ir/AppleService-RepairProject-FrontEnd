import React, { useContext, useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

import { mainUrl } from "../../../config.json"
import { get, post } from '../../utility'
import AuthContext from './../../context/AuthContext'
import LoadingContext from './../../context/LoadingContext'

import Alert from '../../components/Alert/Alert'
import PortalModal from '../../components/PortalModal/PortalModal'

function UserOrders() {
  const authContext = useContext(AuthContext)
  const loadingContext = useContext(LoadingContext)

  const [allOrders, setAllOrders] = useState(
    { all: [], pending: {}, working: {}, paymentWoring: {}, paymentDone: {} }
  )
  const [modal, setModal] = useState({ show: false, order: {} })

  useEffect(() => {
    loadingContext.setProgressIsLoadingHandler(true)
    if (authContext.userToken) {
      document.title = "سفارشات - داشبورد اپل سرویس"
      get(`/orders/log?token=${authContext.userToken}`)
        .then((response) => {
          const pendingOrder = response.data.orders.find(order => order.status === 'pending')
          const workingOrder = response.data.orders.find(order => order.status === 'working')
          const paymentWorkingOrder = response.data.orders.find(
            order => order.status === 'payment-working'
          )
          const doneOrders = response.data.orders.filter(order => order.status === 'done')
          const paymentDoneOrder = response.data.orders.find(
            order => order.status === 'payment-done'
          )
          const cancelledOrders = response.data.orders.filter(order => order.status === 'cancelled')

          setAllOrders(
            {
              all: [...doneOrders, ...cancelledOrders],
              pending: pendingOrder || {},
              working: workingOrder || {},
              paymentWoring: paymentWorkingOrder || {},
              paymentDone: paymentDoneOrder || {},
            }
          )
        })
        .finally(() => loadingContext.setProgressIsLoadingHandler(false))
    }
  }, [authContext.userToken])

  const cancelOrder = orderId => {
    post('/orders/cancel', { orderId, token: authContext.userToken })
      .then(response => {
        setAllOrders(prev => ({
          ...prev,
          pending: {},
          all: [response.data.order, ...prev.all]
        }))
        toast.success("سفارش شما با موفقیت لغو شد")
      }).catch((err) => {
        toast.error(err.response.data.err)
      })
  }

  const workingPayHandler = orderId => {
    const requestBody = {
      token: authContext.userToken,
      id: orderId
    }
    post('/payments/pay', requestBody)
      .then(response => {
        location.href = response.data.url
      })
      .catch(error => console.error(error.response.data.err))
  }

  const donePayHandler = orderId => {
    const requestBody = {
      token: authContext.userToken,
      id: orderId
    }
    post('/payments/pay', requestBody)
      .then(response => {
        location.href = response.data.url
      })
      .catch(error => console.error(error.response.data.err))
  }

  return (
    <>
      <div className='w-full flex flex-col justify-center items-center gap-6 show-fade'>
        {
          Object.keys(allOrders.pending).length > 0 && (
            <div className={`bg-blue-200 w-full flex flex-col justify-center items-center gap-3
              rounded-xl p-3`}>
              <div className={`bg-blue-300 flex justify-center items-center gap-3 px-9 py-2
                    rounded-full relative shadow-sm shadow-blue-500`}>
                <span>کد سفارش:</span>
                <button className='flex justify-center items-center relative group'>
                  <span>#{allOrders.pending.id}</span>
                  <span className='tooltip'>کپی کنید!</span>
                </button>
                <div className={`bg-blue-500 text-white w-3/4 text-center text-xs p-0.5 rounded-b-full
                  absolute top-full shadow-sm shadow-blue-700`}>در انتظار تایید</div>
              </div>
              <ul className='w-full flex flex-col mt-6'>
                <ul className={`border-blue-300 border-t-2 border-dashed w-full
                      flex flex-col justify-center items-start gap-3 p-3
                      sm:flex-row sm:items-center`}>
                  <li className='flex justify-center items-center gap-3'>
                    <span className='sansbold'>نام دستگاه: </span>
                    <span className='text-sm'>{allOrders.pending.phoneName}</span>
                  </li>
                  <span className='hidden sm:block'>-</span>
                  <li className='flex justify-center items-center gap-3'>
                    <span className='sansbold'>قطعات:</span>
                    <span className='text-sm'>{allOrders.pending.partName}</span>
                  </li>
                </ul>
                <li className={`border-blue-300 border-t-2 border-dashed w-full
                      flex gap-3 p-3`}>
                  <span className='sansbold'>آدرس:</span>
                  <p className='text-sm'>{allOrders.pending.address}</p>
                </li>
                <li className={`border-blue-300 border-t-2 border-dashed w-full
                      flex gap-3 p-3`}>
                  <span className='sansbold'>توضیحات:</span>
                  <p className='text-sm'>{allOrders.pending.description}</p>
                </li>
                {
                  allOrders.pending.adminMessage && (
                    <li className={`border-blue-300 border-t-2 border-dashed w-full
                          flex gap-3 p-3`}>
                      <span className='sansbold'>پیام پشتیبانی:</span>
                      <p className='text-sm'>{allOrders.pending.adminMessage}</p>
                    </li>
                  )
                }
              </ul>
              <button className='badge-btn badge-danger px-6'
                onClick={() => cancelOrder(allOrders.pending.id)}>لغو سفارش</button>
            </div>
          )
        }
        {
          Object.keys(allOrders.working).length > 0 && (
            <div className={`bg-yellow-200 w-full flex flex-col justify-center items-center gap-3
              rounded-xl p-3`}>
              <div className={`bg-yellow-300 flex justify-center items-center gap-3 px-12 py-2
                  rounded-full relative shadow-sm shadow-yellow-500`}>
                <span>کد سفارش:</span>
                <span>{allOrders.working.id} #</span>
                <div className={`bg-yellow-500 text-white w-3/4 text-center text-xs
                  p-0.5 rounded-b-full
                  absolute top-full shadow-sm shadow-yellow-700`}>
                  {
                    allOrders.working.total ? 'در حال انجام - پرداخت شده' : 'در حال انجام'
                  }
                </div>
              </div>
              <ul className='w-full flex flex-col mt-6'>
                <li className={`border-yellow-300 border-t-2 border-dashed w-full
                    flex justify-center items-center gap-3 p-3`}>
                  <span className='sansbold'>نام دستگاه: </span>
                  <span className='text-sm'>{allOrders.working.phoneName}</span>
                  <span>-</span>
                  <span className='sansbold'>قطعات:</span>
                  <span className='text-sm'>{allOrders.working.partName}</span>
                </li>
                <li className={`border-yellow-300 border-t-2 border-dashed w-full
                    flex gap-3 p-3`}>
                  <span className='sansbold'>آدرس:</span>
                  <p className='text-sm'>{allOrders.working.address}</p>
                </li>
                <li className={`border-yellow-300 border-t-2 border-dashed w-full
                    flex gap-3 p-3`}>
                  <span className='sansbold'>توضیحات:</span>
                  <p className='text-sm'>{allOrders.working.description}</p>
                </li>
                {
                  allOrders.working.adminMessage && (
                    <li className={`border-yellow-300 border-t-2 border-dashed w-full
                        flex gap-3 p-3`}>
                      <span className='sansbold'>پیام پشتیبانی:</span>
                      <p className='text-sm'>{allOrders.working.adminMessage}</p>
                    </li>
                  )
                }
                <li className={`border-yellow-300 border-t-2 border-dashed w-full
                    flex gap-3 p-3`}>
                  <span className='sansbold'>مشخصات تعمیرکار:</span>
                  <p className='text-sm'>
                    {allOrders.working.repairman.firstName} {allOrders.working.repairman.lastName} - {allOrders.working.repairman.phone}
                  </p>
                </li>
                {
                  allOrders.working.total && (
                    <li className={`border-yellow-300 border-t-2 border-dashed w-full
                      flex gap-3 p-3`}>
                      <span className='sansbold'>پرداخت شده:</span>
                      <p className='text-sm'>
                        {allOrders.working.total.toLocaleString()}
                        <small className='italic mr-1'>تومان</small>
                      </p>
                    </li>
                  )
                }
              </ul>
            </div>
          )
        }
        {
          Object.keys(allOrders.paymentWoring).length > 0 && (
            <div className={`bg-yellow-200 w-full flex flex-col justify-center items-center gap-3
              rounded-xl p-3`}>
              <div className={`bg-yellow-300 flex justify-center items-center gap-3 px-9 py-2
                rounded-full relative shadow-sm shadow-yellow-500`}>
                <span>کد سفارش:</span>
                <button className='flex justify-center items-center relative group'>
                  <span>#{allOrders.paymentWoring.id}</span>
                  <span className='tooltip'>کپی کنید!</span>
                </button>
                <div className={`bg-yellow-500 text-white w-3/4 text-center text-xs p-0.5 rounded-b-full
                  absolute top-full shadow-sm shadow-yellow-700`}>در انتظار پرداخت</div>
              </div>
              <ul className='w-full flex flex-col mt-6'>
                <ul className={`border-yellow-300 border-t-2 border-dashed w-full
                  flex flex-col justify-center items-start gap-3 p-3
                  sm:flex-row sm:items-center`}>
                  <li className='flex justify-center items-center gap-3'>
                    <span className='sansbold'>نام دستگاه: </span>
                    <span className='text-sm'>{allOrders.paymentWoring.phoneName}</span>
                  </li>
                  <span className='hidden sm:block'>-</span>
                  <li className='flex justify-center items-center gap-3'>
                    <span className='sansbold'>قطعات:</span>
                    <span className='text-sm'>{allOrders.paymentWoring.partName}</span>
                  </li>
                </ul>
                <li className={`border-yellow-300 border-t-2 border-dashed w-full
                  flex gap-3 p-3`}>
                  <span className='sansbold'>آدرس:</span>
                  <p className='text-sm'>{allOrders.paymentWoring.address}</p>
                </li>
                <li className={`border-yellow-300 border-t-2 border-dashed w-full
                  flex gap-3 p-3`}>
                  <span className='sansbold'>توضیحات:</span>
                  <p className='text-sm'>{allOrders.paymentWoring.description}</p>
                </li>
                {
                  allOrders.paymentWoring.adminMessage && (
                    <li className={`border-yellow-300 border-t-2 border-dashed w-full
                      flex gap-3 p-3`}>
                      <span className='sansbold'>پیام پشتیبانی:</span>
                      <p className='text-sm'>{allOrders.paymentWoring.adminMessage}</p>
                    </li>
                  )
                }
              </ul>
              <li className={`border-yellow-300 border-t-2 border-dashed w-full
                flex gap-3 p-3 pb-0`}>
                <span className='sansbold'>هزینه تعمیر:</span>
                <span>
                  {
                    allOrders.paymentWoring.transactions.filter(action => action.status === 'pending')[0] &&
                    allOrders.paymentWoring.transactions.filter(action => action.status === 'pending').map(action => action.price).reduce((prev, current) => prev + current).toLocaleString()
                  }
                  <small className='italic mr-1'>تومان</small>
                </span>
              </li>
              <button className='badge-btn badge-warning px-6'
                onClick={() => workingPayHandler(allOrders.paymentWoring.id)}>پرداخت</button>
            </div>
          )
        }
        {
          Object.keys(allOrders.paymentDone).length > 0 && (
            <div className={`bg-green-200 w-full flex flex-col justify-center items-center gap-3
              rounded-xl p-3`}>
              <div className={`bg-green-300 flex justify-center items-center gap-3 px-9 py-2
                rounded-full relative shadow-sm shadow-green-500`}>
                <span>کد سفارش:</span>
                <button className='flex justify-center items-center relative group'>
                  <span>#{allOrders.paymentDone.id}</span>
                  <span className='tooltip'>کپی کنید!</span>
                </button>
                <div className={`bg-green-500 text-white w-3/4 text-center text-xs p-0.5 rounded-b-full
                  absolute top-full shadow-sm shadow-green-700`}>در انتظار پرداخت</div>
              </div>
              <ul className='w-full flex flex-col mt-6'>
                <ul className={`border-green-300 border-t-2 border-dashed w-full
                      flex flex-col justify-center items-start gap-3 p-3
                      sm:flex-row sm:items-center`}>
                  <li className='flex justify-center items-center gap-3'>
                    <span className='sansbold'>نام دستگاه: </span>
                    <span className='text-sm'>{allOrders.paymentDone.phoneName}</span>
                  </li>
                  <span className='hidden sm:block'>-</span>
                  <li className='flex justify-center items-center gap-3'>
                    <span className='sansbold'>قطعات:</span>
                    <span className='text-sm'>{allOrders.paymentDone.partName}</span>
                  </li>
                </ul>
                <li className={`border-green-300 border-t-2 border-dashed w-full
                  flex gap-3 p-3`}>
                  <span className='sansbold'>آدرس:</span>
                  <p className='text-sm'>{allOrders.paymentDone.address}</p>
                </li>
                <li className={`border-green-300 border-t-2 border-dashed w-full
                  flex gap-3 p-3`}>
                  <span className='sansbold'>توضیحات:</span>
                  <p className='text-sm'>{allOrders.paymentDone.description}</p>
                </li>
                {
                  allOrders.paymentDone.adminMessage && (
                    <li className={`border-green-300 border-t-2 border-dashed w-full
                      flex gap-3 p-3`}>
                      <span className='sansbold'>پیام پشتیبانی:</span>
                      <p className='text-sm'>{allOrders.paymentDone.adminMessage}</p>
                    </li>
                  )
                }
                <li className={`border-green-300 border-t-2 border-dashed w-full
                  flex gap-3 p-3`}>
                  <span className='sansbold'>در انتظار پرداخت:</span>
                  <span className='text-sm'>
                    {
                      allOrders.paymentDone.transactions.filter(action => action.status === 'pending').map(action => action.price).reduce((prev, current) => prev + current).toLocaleString()
                    }
                    <small className='italic mr-1'>تومان</small>
                  </span>
                </li>
                {
                  allOrders.paymentDone.total && (
                    <li className={`border-green-300 border-t-2 border-dashed w-full
                    flex gap-3 p-3 pb-0`}>
                      <span className='sansbold'>پرداخت شده:</span>
                      <span className='text-sm'>
                        {allOrders.paymentDone.total.toLocaleString()}
                        <small className='italic mr-1'>تومان</small>
                      </span>
                    </li>
                  )
                }
              </ul>
              <button className='badge-btn badge-success px-6'
                onClick={() => donePayHandler(allOrders.paymentDone.id)}>پرداخت</button>
            </div>
          )
        }
        {
          allOrders.all.length > 0 && (
            <h2 className='w-full text-right text-xl sansbold'>لیست سفارشات تمام شده</h2>
          )
        }
        {
          allOrders.all.length > 0 ? (
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
                    allOrders.all.map(order => (
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
                                {order.total}
                                <small className='italic mr-1'>تومان</small>
                              </>
                            ) : '-'
                          }
                        </td>
                        <td className='tbody__tr__td w-2/12 text-sm'>
                          {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          ) : (
            <Alert
              theme={'danger'}
              title={'شما هیچ سفارش تمام شده ای ندارید!'}
              link={'/order'}
              linkTitle={'ثبت سفارش'}
              icon={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
            />
          )
        }
      </div >

      {
        modal.show && (
          <PortalModal closeHandler={() => setModal({ show: false, order: {} })}>
            <ul className="w-[500px] max-h-[80vh] overflow-y-scroll rounded-md">
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
                    modal.order.repairman ?
                      `${modal.order.repairman.firstName} ${modal.order.repairman.lastName} - ${modal.order.repairman.phone}`
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
                    href={`${mainUrl.replace('/api', '')}/uploads/${modal.order.picture}`}
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
          </PortalModal>
        )
      }

      <Toaster />
    </>
  )
}

export default UserOrders