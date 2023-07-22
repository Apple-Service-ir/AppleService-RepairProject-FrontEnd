import React, { useContext, useEffect, useRef, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

import { baseURL } from '../../../config.json'
import AuthContext from '../../context/AuthContext'
import LoadingContext from '../../context/LoadingContext'
import { get, post } from '../../utils/connection'
import PortalModal from '../../components/PortalModal/PortalModal'
import Alert from '../../components/Alert/Alert'
import OrderStatusBtn from '../../components/OrderStatusBtn/OrderStatusBtn'
import SubmitBtn from '../../components/SubmitBtn/SubmitBtn'
import OrderDetails from '../../components/OrderDetails/OrderDetails'
import OrderStatusBox from '../../components/OrderStatusBox/OrderStatusBox'

function RepairManGetOrder() {
  const authContext = useContext(AuthContext)
  const loadingContext = useContext(LoadingContext)

  const [orders, setOrders] = useState({ pending: [], inWorking: {}, inPaymentDone: [] })
  const [submitOrderModal, setSubmitOrderModal] = useState({ show: false, order: {} })
  const [orderStatusLoadings, setOrderStatusLoadings] = useState({
    accept: false, paymentAccept: false, cancel: false, done: false, paymentDone: false
  })
  const [changePriceForOrderLoading, setChangePriceForOrderLoading] = useState({
    accept: false, delete: false
  })
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showDonePaymentModal, setShowDonePaymentModal] = useState(false)
  const [paymentOrdersModal, setPaymentOrdersModal] = useState({ show: false, order: {} })

  const priceInputRef = useRef()
  const submitPriceInputRef = useRef()
  const donePriceInputRef = useRef()

  useEffect(() => {
    if (authContext.userToken)
      get('/repairmans/orders/get', authContext.userToken)
        .then(response => {
          const pendingOrders = response.data.orders.filter(order => order.status === 'pending')
          const inWorkingOrder = response.data.orders.filter(order => (
            (order.repairmanId === authContext.userInfo.id && order.status === 'working' || order.status === 'payment-working')
          ))
          const inPaymentDoneOrder = response.data.orders.filter(order => (
            (order.repairmanId === authContext.userInfo.id && order.status === 'payment-done')
          ))
          setOrders({
            pending: pendingOrders,
            inWorking: inWorkingOrder[0] || {},
            inPaymentDone: inPaymentDoneOrder[0] ? inPaymentDoneOrder : [],
          })
        })
        .finally(() => loadingContext.setProgressIsLoadingHandler(false))
  }, [authContext.userToken])

  const submitOrderHandler = async (event, hasPrice, orderId) => {
    event.preventDefault()

    if (hasPrice && priceInputRef.current.value < 100_000) {
      return toast.error('حداقل مبلغ باید 100 هزار تومان باشد')
    }

    setOrderStatusLoadings({ accept: !hasPrice, paymentAccept: hasPrice })

    const requestBody = {
      id: orderId,
      ...(hasPrice && { status: 'payment-working', price: +priceInputRef.current.value })
    }
    await post('/repairmans/orders/accept', authContext.userToken, requestBody)
      .then(response => {
        setSubmitOrderModal(prev => ({ ...prev, order: response.data.order }))

        setOrders(prev => {
          const newPendingOrders = prev.pending.filter(order => order.id !== orderId)
          return {
            ...prev,
            pending: newPendingOrders,
            inWorking: response.data.order
          }
        })
        toast.success('سفارش یا موفقیت تایید شد')
      })
      .catch(error => toast.error(error.response.data.err))
    setShowPaymentModal(false)
    setOrderStatusLoadings({ accept: false, paymentAccept: false })
  }

  const cancelledSubmitOrderHandler = async orderId => {
    setOrderStatusLoadings({ cancel: true })

    const requestBody = {
      id: orderId
    }
    await post('/repairmans/orders/cancel', authContext.userToken, requestBody)
      .then(response => {
        setSubmitOrderModal(prev => ({ ...prev, order: response.data.order }))

        setOrders(prev => {
          return {
            ...prev,
            pending: [...prev.pending, response.data.order],
            inWorking: {},
          }
        })
        toast.success('سفارش با موفقیت لفو شد')
      })
      .catch(error => toast.error(error.response.data.err))
    setOrderStatusLoadings({ cancel: false })
  }

  const doneOrderHandler = async (event, hasPrice, orderId) => {
    event.preventDefault()

    if (hasPrice && donePriceInputRef.current.value < 100_000) {
      return toast.error('حداقل مبلغ باید 100 هزار تومان باشد')
    }

    setOrderStatusLoadings({ done: !hasPrice, paymentDone: hasPrice })

    const requestBody = {
      id: orderId,
      ...(hasPrice && { status: 'payment-done', price: +donePriceInputRef.current.value })
    }
    await post('/repairmans/orders/done', authContext.userToken, requestBody)
      .then(response => {
        setOrders(prev => ({
          ...prev,
          inWorking: {},
          inPaymentDone: hasPrice ? [response.data.order, ...prev.inPaymentDone] : {}
        }))
        toast.success('سفارش با موفقیت به اتمام رسید، خسته نباشید')
      })
      .catch(error => toast.error(error.response.data.err))
    setSubmitOrderModal({ show: false, order: {} })
    setOrderStatusLoadings({ done: false, paymentDone: false })
  }

  const submitPriceForOrder = async orderId => {
    if (submitPriceInputRef.current.value < 100_000) {
      return toast.error('حداقل مبلغ باید 100 هزار تومان باشد')
    }
    setChangePriceForOrderLoading({ accept: true })

    const requestBody = {
      id: orderId,
      price: submitPriceInputRef.current.value
    }
    await post('/repairmans/orders/price/set', authContext.userToken, requestBody)
      .then(response => {
        console.log(response)
        setOrders(prev => ({
          ...prev,
          inWorking: response.data.order
        }))
        setSubmitOrderModal(prev => ({ ...prev, order: response.data.order }))
        submitPriceInputRef.current.value = ''
        toast.success('قیمت با موفقیت تعیین شد')
      })
      .catch(error => toast.error(error.response.data.err))
    setChangePriceForOrderLoading({ accept: false })
  }

  const deltePriceForOrder = async orderId => {
    setChangePriceForOrderLoading({ delete: true })

    const requestBody = {
      id: orderId,
      price: '0'
    }
    await post('/repairmans/orders/price/set', authContext.userToken, requestBody)
      .then(response => {
        setOrders(prev => ({
          ...prev,
          inWorking: response.data.order
        }))
        setSubmitOrderModal(prev => ({ ...prev, order: response.data.order }))
        submitPriceInputRef.current.value = ''
        toast.success('قیمت با موفقیت پاک شد')
      })
      .catch(error => toast.error(error.response.data.err))
    setChangePriceForOrderLoading({ delete: false })
  }

  return (
    <>
      <div className='w-full flex flex-col justify-center items-center gap-6 show-fade'>
        {
          orders.inPaymentDone.length === 1 && (
            <OrderStatusBox
              order={orders.inPaymentDone[0]}
            />
          )
        }
        {
          orders.inPaymentDone.length > 1 && (
            <div className="w-full">
              <h1 className='w-full text-right text-xl sansbold'>
                سفارش های در انتظار پرداخت
              </h1>
              <div className="w-full overflow-x-auto rounded-xl mt-3">
                <table className='table'>
                  <thead className='thead'>
                    <tr className='thead__tr'>
                      <th className='thead__tr__th w-2/12'>کد سفارش</th>
                      <th className='thead__tr__th w-3/12'>نام دستگاه</th>
                      <th className='thead__tr__th w-3/12'>قطعات</th>
                      <th className='thead__tr__th w-2/12'>در انتظار پرداخت</th>
                      <th className='thead__tr__th w-2/12'>تاریخ</th>
                    </tr>
                  </thead>
                  <tbody className='tbody'>
                    {
                      orders.inPaymentDone.map(order => (
                        <tr
                          key={order.id}
                          className='tbody__tr cursor-pointer'
                          onClick={() => {
                            setPaymentOrdersModal({ show: true, order })
                          }}
                        >
                          <td className='tbody__tr__td w-2/12'>
                            <div className='td__wrapper justify-center'>
                              <div className='badge badge-success select-text'>{order.id} #</div>
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
                              order.transactions.filter(action => action.status === 'pending').map(action => action.price).reduce((prev, current) => prev + current).toLocaleString()
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
            </div>
          )
        }
        {
          Object.keys(orders.inWorking).length ? (
            <div className='w-full overflow-x-auto'>
              <h1 className='w-full text-right text-xl sansbold mb-3'>سفارش درحال تعمیر</h1>
              <ul className="bg-yellow-200 w-[825px] h-12 flex justify-between items-center 
                pr-6 rounded-xl relative mb-3 sm:w-full">
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
                          orders.inWorking.transactions.filter(action => action.status === 'pending').map(action => action.price).reduce((prev, current) => prev + current).toLocaleString()
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
                        href={`${baseURL}/uploads/${orders.inWorking.picture}`}
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
        <div className="w-full overflow-x-auto">
          {
            orders.pending.length > 0 ? orders.pending.map(order => (
              <div className="w-full">
                <h1 className='w-full text-right text-xl sansbold mb-3'>سفارش های در انتظار تایید</h1>
                <ul key={order.id} className="bg-green-200 w-[750px] h-12
                flex justify-between items-center
                pr-6 rounded-xl relative mb-3 sm:w-full">
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
                      href={`${baseURL}/uploads/${order.picture}`}
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
              </div>
            )) : (
              <Alert
                theme={'danger'}
                title={'سفارشی ثبت نشده است'}
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
                      isLoading={false}
                      // isLoading={orderStatusLoadings.done}
                      clickHandler={() => setShowDonePaymentModal(true)}
                    >
                      اتمام تعمیر
                    </OrderStatusBtn>
                  </li>
                )
              }

              <OrderDetails order={submitOrderModal.order} />

              {
                (submitOrderModal.order.status === 'working'
                  || submitOrderModal.order.status === 'payment-working') && (
                  <li className='w-full flex flex-col justify-center items-center rounded-md mt-1 '>
                    <div className="bg-blue-100 text-blue-500 w-full p-3 rounded-t-md text-center">
                      تعیین قیمت برای تعمیر
                    </div>
                    <div className="bg-white w-full flex flex-col justify-center items-center p-3 
                      gap-3 rounded-b-md">
                      <div className='w-full bg-input'>
                        <input
                          className='input'
                          id='submit-price-input'
                          type="number"
                          inputMode='decimal'
                          placeholder='قیمت به تومان'
                          ref={submitPriceInputRef}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                        </svg>
                      </div>
                      <div className="w-full flex justify-center items-center gap-3">
                        <SubmitBtn
                          customClass={'w-1/2'}
                          isLoading={changePriceForOrderLoading.accept}
                          clickHandler={() => submitPriceForOrder(submitOrderModal.order.id)}
                        >
                          ثبت
                        </SubmitBtn>
                        <SubmitBtn
                          type={'danger'}
                          customClass={'w-1/2'}
                          isLoading={changePriceForOrderLoading.delete}
                          clickHandler={() => deltePriceForOrder(submitOrderModal.order.id)}
                        >
                          حذف قیمت
                        </SubmitBtn>
                      </div>
                    </div>
                  </li>
                )
              }
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
                  type="number"
                  inputMode='decimal'
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

      {
        (submitOrderModal.show && showDonePaymentModal) && (
          <PortalModal
            closeHandler={() => setShowDonePaymentModal(false)}
            asAlert={true}
          >
            <form className='bg-white w-96 flex flex-col justify-center items-center gap-3 p-6 rounded-xl'>
              <label
                className='text-blue-500 sansbold text-center'
                htmlFor="payment-input"
              >
                سفارش مشمول هزینه می باشد؟
              </label>
              <div className='w-full bg-input'>
                <input
                  className='input'
                  id='payment-input'
                  type="number"
                  inputMode='decimal'
                  placeholder='قیمت به تومان'
                  ref={donePriceInputRef}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <div className="w-full flex justify-center items-center gap-3">
                <SubmitBtn
                  customClass={'w-1/2'}
                  isLoading={orderStatusLoadings.paymentDone}
                  clickHandler={event => doneOrderHandler(event, true, submitOrderModal.order.id)}
                >
                  تایید قیمت
                </SubmitBtn>
                <SubmitBtn
                  type={'outline'}
                  customClass={'w-1/2'}
                  isLoading={orderStatusLoadings.done}
                  clickHandler={event => doneOrderHandler(event, false, submitOrderModal.order.id)}
                >
                  خیر، ادامه
                </SubmitBtn>
              </div>
            </form>
          </PortalModal>
        )
      }

      {
        paymentOrdersModal.show && (
          <PortalModal closeHandler={() => setPaymentOrdersModal({ show: false, order: {} })}>
            <ul className="w-[500px] max-h-[80vh] overflow-y-scroll rounded-md">
              <li className='w-full flex justify-center items-center rounded-md'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  کد سفارش
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {paymentOrdersModal.order.id} #
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  وضعیت
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  در انتظار پرداخت
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  مشتری
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {
                    `${paymentOrdersModal.order.user.firstName} ${paymentOrdersModal.order.user.lastName} - ${paymentOrdersModal.order.user.phone}`
                  }
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  دستگاه
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {paymentOrdersModal.order.phoneName}
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  قطعه
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {paymentOrdersModal.order.partName}
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  تاریخ
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {new Date(paymentOrdersModal.order.createdAt).toLocaleDateString('fa-IR')}
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  در انتظار پرداخت
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {
                    paymentOrdersModal.order.transactions.filter(action => action.status === 'pending').map(action => action.price).reduce((prev, current) => prev + current).toLocaleString()
                  }
                </div>
              </li>

              {
                paymentOrdersModal.order.total && (
                  <li className='w-full flex justify-center items-center rounded-md mt-1'>
                    <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                      پرداخت شده
                    </div>
                    <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                      {
                        paymentOrdersModal.order.total.toLocaleString()
                      }
                    </div>
                  </li>
                )
              }

              <li className='w-full flex justify-center items-center rounded-md mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
                  تصویر
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  <a
                    className='underline'
                    href={`${baseURL}/uploads/${paymentOrdersModal.order.picture}`}
                    target='_blank'
                  >مشاهده</a>
                </div>
              </li>

              {
                paymentOrdersModal.order.adminMessage && (
                  <li className='w-full flex flex-col justify-center items-center rounded-md mt-1'>
                    <div className="bg-blue-100 text-blue-500 w-full p-3 rounded-t-md text-center">
                      پیام پشتیبانی
                    </div>
                    <div className="bg-white w-full flex justify-center items-center p-3 rounded-b-md
                      text-center break-all">
                      {paymentOrdersModal.order.adminMessage}
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
                  {paymentOrdersModal.order.address}
                </div>
              </li>

              <li className='w-full flex flex-col justify-center items-center rounded-md mt-1 '>
                <div className="bg-blue-100 text-blue-500 w-full p-3 rounded-t-md text-center">
                  توضیحات
                </div>
                <div className="bg-white w-full flex justify-center items-center p-3 rounded-b-md
                  text-center break-all">
                  {paymentOrdersModal.order.description}
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

export default RepairManGetOrder