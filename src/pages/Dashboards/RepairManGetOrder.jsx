import React, { useContext, useEffect, useRef, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

import { mainUrl } from '../../../config.json'
import PortalModal from '../../components/PortalModal/PortalModal'
import AuthContext from '../../context/AuthContext'
import LoadingContext from '../../context/LoadingContext'
import { get, post } from '../../utility'
import Alert from '../../components/Alert/Alert'
import OrderStatusBtn from '../../components/OrderStatusBtn/OrderStatusBtn'
import SubmitBtn from '../../components/SubmitBtn/SubmitBtn'

function RepairManGetOrder() {
  const authContext = useContext(AuthContext)
  const loadingContext = useContext(LoadingContext)

  const [orders, setOrders] = useState({ all: [], pending: [], inWorking: {} })
  const [submitOrderModal, setSubmitOrderModal] = useState({ show: false, order: {} })
  const [orderStatusLoadings, setOrderStatusLoadings] = useState({
    accept: false, paymentAccept: false, cancel: false, done: false
  })
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const priceInputRef = useRef()

  useEffect(() => {
    loadingContext.setProgressIsLoadingHandler(true)
    if (authContext.userToken)
      get(`/repairmans/orders/get?token=${authContext.userToken}`)
        .then(response => {
          const pendingOrders = response.data.orders.filter(order => order.status === 'pending')
          const inWorkingOrder = response.data.orders.filter(order => (
            (order.repairmanId === authContext.userInfo.id && order.status === 'working' || order.status === 'payment-working')
          ))
          setOrders({
            all: response.data.orders,
            pending: pendingOrders,
            inWorking: inWorkingOrder[0] || {}
          })
        })
        .finally(() => loadingContext.setProgressIsLoadingHandler(false))
  }, [authContext.userInfo])

  const submitOrderHandler = async (event, hasPrice, orderId) => {
    event.preventDefault()

    if (hasPrice && priceInputRef.current.value < 100_000) {
      return toast.error('حداقل مبلغ باید 100 هزار تومان باشد')
    }

    setOrderStatusLoadings({ accept: !hasPrice, paymentAccept: hasPrice, cancel: false, done: false })

    const requestBody = {
      token: authContext.userToken,
      id: orderId,
      ...(hasPrice && { status: 'payment-working', price: +priceInputRef.current.value })
    }
    await post('/repairmans/orders/accept', requestBody)
      .then(response => {
        setSubmitOrderModal(prev => ({ ...prev, order: response.data.order }))

        setOrders(prev => {
          const newPendingOrders = prev.pending.filter(order => order.id !== orderId)
          return {
            all: prev.all,
            pending: newPendingOrders,
            inWorking: response.data.order
          }
        })
        toast.success('سفارش یا موفقیت تایید شد')
      })
      .catch(error => toast.error(error.response.data.err))
    setShowPaymentModal(false)
    setOrderStatusLoadings({ accept: false, paymentAccept: false, cancel: false, done: false })
  }

  const cancelledSubmitOrderHandler = async orderId => {
    setOrderStatusLoadings({ accept: false, paymentAccept: false, cancel: true, done: false })

    const requestBody = {
      token: authContext.userToken,
      id: orderId
    }
    await post('/repairmans/orders/cancel', requestBody)
      .then(response => {
        setSubmitOrderModal(prev => ({ ...prev, order: response.data.order }))

        setOrders(prev => {
          return {
            all: prev.all,
            pending: [...prev.pending, response.data.order],
            inWorking: {}
          }
        })
        toast.success('سفارش با موفقیت لفو شد')
      })
      .catch(error => toast.error(error.response.data.err))
    setOrderStatusLoadings({ accept: false, paymentAccept: false, cancel: false, done: false })
  }

  const doneOrderHandler = async orderId => {
    setOrderStatusLoadings({ accept: false, paymentAccept: false, cancel: false, done: true })

    const requestBody = {
      token: authContext.userToken,
      id: orderId
    }
    await post('/repairmans/orders/done', requestBody)
      .then(response => {
        setOrders(prev => ({
          ...prev,
          all: [...prev.all, response.data.order],
          inWorking: {}
        }))
        toast.success('سفارش با موفقیت به اتمام رسید، خسته نباشید')
      })
      .catch(error => toast.error(error.response.data.err))
    setSubmitOrderModal({ show: false, order: {} })
    setOrderStatusLoadings({ accept: false, paymentAccept: false, cancel: false, done: false })
  }

  return (
    <>
      <div className='w-full flex flex-col justify-center items-center gap-6 show-fade'>
        {
          Object.keys(orders.inWorking).length ? (
            <div className='w-full'>
              <h1 className='w-full text-right text-xl sansbold mb-3'>سفارش درحال تعمیر</h1>
              <ul className="bg-yellow-200 w-full h-12 flex justify-between items-center 
                pr-6 rounded-xl relative mb-3">
                <span className='px-2 text-sm opacity-90'>{orders.inWorking.id} #</span>
                <li>
                  نام دستگاه:
                  <span className='px-2 text-sm opacity-90'>{orders.inWorking.phoneName}</span>
                </li>
                <li>
                  نام قطعه:
                  <span className='px-2 text-sm opacity-90'>{orders.inWorking.partName}</span>
                </li>
                {
                  orders.inWorking.status === 'payment-working' && (
                    <li className='bg-yellow-300 py-0.5 pr-2 rounded-full'>
                      در انتطار پرداخت
                      <span className='px-2 text-sm opacity-90'>
                        {
                          orders.inWorking.transactions.filter(action => action.status === 'pending').map(action => action.price).reduce((prev, current) => prev + current)
                        }
                        <small className='mr-1 italic'>تومان</small>
                      </span>
                    </li>
                  )
                }
                {
                  orders.inWorking.status === 'working' && (
                    <li>
                      تصویر:
                      <a
                        href={`${mainUrl.replace('/api', '')}/uploads/${orders.inWorking.picture}`}
                        className='px-2 underline text-sm opacity-90'
                        target="_blank"
                      >
                        مشاهده
                      </a>
                    </li>
                  )
                }
                <button
                  className='bg-yellow-300 w-16 h-full flex justify-center items-center rounded-l-xl
                    hover:bg-yellow-400'
                  onClick={() => {
                    setSubmitOrderModal({ show: true, order: orders.inWorking })
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </ul>
            </div>
          ) : ''
        }
        <div className="w-full">
          <h1 className='w-full text-right text-xl sansbold mb-3'>سفارش های در انتظار تایید</h1>
          {
            orders.pending.length > 0 ? orders.pending.map(order => (
              <ul key={order.id} className="bg-green-200 w-full h-12 flex justify-between items-center 
                pr-6 rounded-xl relative mb-3">
                <span className='px-2 text-sm opacity-90'>{order.id} #</span>
                <li>
                  نام دستگاه:
                  <span className='px-2 text-sm opacity-90'>{order.phoneName}</span>
                </li>
                <li>
                  نام قطعه:
                  <span className='px-2 text-sm opacity-90'>{order.partName}</span>
                </li>
                <li>
                  تصویر:
                  <a
                    href={`${mainUrl.replace('/api', '')}/uploads/${order.picture}`}
                    className='px-2 underline text-sm opacity-90'
                    target="_blank"
                  >
                    مشاهده
                  </a>
                </li>
                <button
                  className='bg-green-300 w-16 h-full flex justify-center items-center rounded-l-xl
                  hover:bg-green-400'
                  onClick={() => {
                    setSubmitOrderModal({ show: true, order })
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </ul>
            )) : (
              <Alert
                theme={'danger'}
                title={'هیچ سفارشی در حال انتظار نیست!'}
                icon={(
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                )}
              />
            )
          }
        </div>
      </div>

      {
        submitOrderModal.show && (
          <PortalModal closeHandler={() => setSubmitOrderModal({ show: false, order: {} })}>
            <ul className="w-[500px] max-h-[80vh] overflow-y-scroll rounded-md">
              {
                submitOrderModal.order.status === 'pending' ? (
                  <OrderStatusBtn
                    customStyles={'w-full'}
                    status={'working'}
                    isLoading={false}
                    clickHandler={() => setShowPaymentModal(true)}
                  >
                    تایید کردن
                  </OrderStatusBtn>
                ) : (
                  <li className='w-full flex gap-1'>
                    <OrderStatusBtn
                      customStyles={'w-full'}
                      status={'cancelled'}
                      isLoading={orderStatusLoadings.cancel}
                      clickHandler={() => cancelledSubmitOrderHandler(submitOrderModal.order.id)}
                    >
                      لغو تعمیر
                    </OrderStatusBtn>
                    <OrderStatusBtn
                      customStyles={'w-full'}
                      status={'done'}
                      isLoading={orderStatusLoadings.done}
                      clickHandler={() => doneOrderHandler(submitOrderModal.order.id)}
                    >
                      اتمام تعمیر
                    </OrderStatusBtn>
                  </li>
                )
              }
              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  کد سفارش
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {submitOrderModal.order.id} #
                </div>
              </li>
              {
                submitOrderModal.order.status === 'payment-working' && (
                  <li className='w-full flex justify-center items-center rounded-md mt-1'>
                    <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                      در انتطار پرداخت
                    </div>
                    <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                      {
                        submitOrderModal.order.transactions.filter(action => action.status === 'pending').map(action => action.price).reduce((prev, current) => prev + current)
                      }
                      <small className='mr-1 italic'>تومان</small>
                    </div>
                  </li>
                )
              }
              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  دستگاه
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {submitOrderModal.order.phoneName}
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  قطعه
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {submitOrderModal.order.partName}
                </div>
              </li>
              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  تاریخ
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {new Date(submitOrderModal.order.createdAt).toLocaleDateString('fa-IR')}
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  تصویر
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  <a
                    className='underline'
                    href={`${mainUrl.replace('/api', '')}/uploads/${submitOrderModal.order.picture}`}
                    target='_blank'
                  >
                    مشاهده
                  </a>
                </div>
              </li>

              {
                submitOrderModal.order.adminMessage && (
                  <li className='w-full flex flex-col justify-center items-center rounded-md mt-1'>
                    <div className="bg-blue-100 text-blue-500 w-full p-3 rounded-t-md text-center">
                      پیام پشتیبانی
                    </div>
                    <div className="bg-white w-full flex justify-center items-center p-3 rounded-b-md
                      text-center break-all">
                      {submitOrderModal.order.adminMessage}
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
                  {submitOrderModal.order.address}
                </div>
              </li>

              <li className='w-full flex flex-col justify-center items-center rounded-md mt-1 '>
                <div className="bg-blue-100 text-blue-500 w-full p-3 rounded-t-md text-center">
                  توضیحات
                </div>
                <div className="bg-white w-full flex justify-center items-center p-3 rounded-b-md
                  text-center break-all">
                  {submitOrderModal.order.description}
                </div>
              </li>
            </ul>
          </PortalModal>
        )
      }

      {
        (submitOrderModal.show && showPaymentModal) && (
          <PortalModal
            closeHandler={() => setShowPaymentModal(false)}
            asAlert={true}
          >
            <form className='bg-white w-96 flex flex-col justify-center items-center gap-3 p-6 rounded-xl'>
              <label
                className='text-blue-500 sansbold text-center'
                htmlFor="payment-input"
              >
                آیا می خواهید قبل از تعمیر پیش پرداخت بگیرید؟
              </label>
              <div className='w-full bg-input'>
                <input
                  className='input'
                  id='payment-input'
                  type="text"
                  placeholder='قیمت به تومان'
                  ref={priceInputRef}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <div className="w-full flex justify-center items-center gap-3">
                <SubmitBtn
                  customClass={'w-1/2'}
                  isLoading={orderStatusLoadings.paymentAccept}
                  clickHandler={event => submitOrderHandler(event, true, submitOrderModal.order.id)}
                >
                  تایید قیمت
                </SubmitBtn>
                <SubmitBtn
                  type={'outline'}
                  customClass={'w-1/2'}
                  isLoading={orderStatusLoadings.accept}
                  clickHandler={event => submitOrderHandler(event, false, submitOrderModal.order.id)}
                >
                  خیر، ادامه
                </SubmitBtn>
              </div>
            </form>
          </PortalModal>
        )
      }

      <Toaster />
    </>
  )
}

export default RepairManGetOrder