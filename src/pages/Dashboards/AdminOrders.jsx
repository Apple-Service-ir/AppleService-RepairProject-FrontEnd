import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'

import { get, post } from '../../utility'
import { useRef } from 'react'
import AuthContext from '../../context/AuthContext'
import LoadingContext from '../../context/LoadingContext'
import Alert from '../../components/Alert/Alert'
import PortalModal from '../../components/PortalModal/PortalModal'
import OrderStatusBtn from '../../components/OrderStatusBtn/OrderStatusBtn'
import SubmitBtn from '../../components/SubmitBtn/SubmitBtn'
import OrderDetails from '../../components/OrderDetails/OrderDetails'

function AdminOrders() {
  const authContext = useContext(AuthContext)
  const loadingContext = useContext(LoadingContext)

  const [orders, setOrders] = useState([])
  const [repairmans, setRepairmans] = useState({
    all: [], selected: {}, currentForOrderCity: []
  })
  const [modal, setModal] = useState({ show: false, order: {} })
  const [showAcceptOrderModal, setShowAcceptOrderModal] = useState(false)
  const [showDoneOrderModal, setShowDoneOrderModal] = useState(false)
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false)
  const [paymentOrderStatusLoding, setPaymentOrderStatusLoading] = useState({
    paymentAccept: false, accept: false, paymentDone: false, done: false, cancel: false, pending: false
  })
  const [orderDesc, setOrderDesc] = useState('')

  const paymentAcceptInputRef = useRef()
  const paymentDoneInputRef = useRef()

  useEffect(() => {
    document.title = "سفارشات - داشبورد مدیریت اپل سرویس"

    const func = async () => {
      await get(`/admins/orders/all?token=${authContext.userToken}`)
        .then(response => {
          setOrders(response.data.orders)
        })

      await get(`/repairmans/all?token=${authContext.userToken}`)
        .then(response => {
          setRepairmans(prev => ({
            ...prev,
            all: response.data.repairmans
          }))
        })

      loadingContext.setProgressIsLoadingHandler(false)
    }

    if (authContext.userToken) func()
  }, [authContext.userToken])

  const acceptOrderHandler = async (event, orderId, status) => {
    event.preventDefault()

    if (status === 'payment-working' && paymentAcceptInputRef.current.value < 100_000)
      return toast.error('حداقل قیمت 100 هزار تومان می باشد')

    if (!Object.keys(repairmans.selected).length)
      return toast.error('لطفا برای سفارش یک تعمیرکار انتخاب کنید')

    setPaymentOrderStatusLoading({
      paymentAccept: status === 'payment-working',
      accept: status === 'working'
    })

    const requestBody = {
      token: authContext.userToken,
      id: orderId,
      status,
      repairmanId: repairmans.selected.id,
      adminMessage: orderDesc || null,
      ...(status === 'payment-working' && { price: +paymentAcceptInputRef.current.value })
    }
    await post('/admins/orders/status', requestBody)
      .then(response => {
        console.log(response.data)
        setOrders(prev => {
          const newOrders = prev.map(order => {
            if (order.id === orderId) {
              return response.data.order
            }
            else {
              return order
            }
          })
          return newOrders
        })

        setModal(prev => ({ ...prev, order: response.data.order }))
        toast.success('تغییر وضعیت با موفقیت انجام شد')
      })
      .catch(error => toast.error(error.response.data.err))

    setPaymentOrderStatusLoading({
      paymentAccept: false,
      accept: false
    })
  }

  const cancelOrderHandler = async (event, orderId) => {
    event.preventDefault()

    setPaymentOrderStatusLoading({
      cancel: true
    })

    const requestBody = {
      token: authContext.userToken,
      id: orderId,
      status: 'cancelled',
      adminMessage: orderDesc || null
    }
    await post('/admins/orders/status', requestBody)
      .then(response => {
        setOrders(prev => {
          const newOrders = prev.map(order => {
            if (order.id === orderId) {
              return response.data.order
            }
            else {
              return order
            }
          })
          return newOrders
        })

        setModal(prev => ({ ...prev, order: response.data.order }))
        toast.success('تغییر وضعیت با موفقیت انجام شد')
      })
      .catch(error => toast.error(error.response.data.err))

    setPaymentOrderStatusLoading({
      cancel: false
    })
  }

  const doneOrderHandler = async (event, orderId, status) => {
    event.preventDefault()

    if (status === 'payment-done' && paymentDoneInputRef.current.value < 100_000) {
      return toast.error('حداقل قیمت 100 هزار تومان می باشد')
    }

    setPaymentOrderStatusLoading({
      paymentDone: status === 'payment-done',
      done: status === 'done'
    })

    const requestBody = {
      token: authContext.userToken,
      id: orderId,
      status,
      adminMessage: orderDesc || null,
      ...(status === 'payment-done' && { price: +paymentDoneInputRef.current.value })
    }
    await post('/admins/orders/status', requestBody)
      .then(response => {
        console.log(response.data)
        setOrders(prev => {
          const newOrders = prev.map(order => {
            if (order.id === orderId) {
              return response.data.order
            }
            else {
              return order
            }
          })
          return newOrders
        })

        setModal(prev => ({ ...prev, order: response.data.order }))
        toast.success('تغییر وضعیت با موفقیت انجام شد')
      })
      .catch(error => toast.error(error.response.data.err))

    setPaymentOrderStatusLoading({
      paymentDone: false,
      done: false
    })
  }

  const pendingOrderHandler = async orderId => {
    setPaymentOrderStatusLoading({
      pending: true
    })

    const requestBody = {
      token: authContext.userToken,
      id: orderId,
      status: 'pending'
    }
    await post('/admins/orders/status', requestBody)
      .then(response => {
        setOrders(prev => {
          const newOrders = prev.map(order => {
            if (order.id === orderId) {
              return response.data.order
            }
            else {
              return order
            }
          })
          return newOrders
        })

        setModal(prev => ({ ...prev, order: response.data.order }))
        toast.success('تغییر وضعیت با موفقیت انجام شد')
      })
      .catch(error => toast.error(error.response.data.err))

    setPaymentOrderStatusLoading({
      pending: false
    })
  }

  return (
    <>
      <div className='w-full flex flex-col items-center show-fade'>
        <h1 className='w-full text-right text-xl sansbold'>لیست سفارشات</h1>
        {
          orders.length > 0 ? (
            <div className="w-full overflow-x-auto rounded-xl mt-1">
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
                      return (
                        <tr
                          key={order.id}
                          className='tbody__tr cursor-pointer'
                          onClick={() => setModal({ show: true, order: order })}
                        >
                          <td className='tbody__tr__td w-2/12'>
                            <div className='td__wrapper justify-center'>
                              {
                                ['done', 'payment-done'].includes(order.status) ? (
                                  <button className='badge badge-success select-text'>{order.id} #</button>
                                ) : ['working', 'payment-working'].includes(order.status) ? (
                                  <button className='badge badge-warning select-text'>{order.id} #</button>
                                ) : order.status === 'pending' ? (
                                  <button className='badge badge-blue select-text'>{order.id} #</button>
                                ) : order.status === 'cancelled' ? (
                                  <button className='badge badge-danger select-text'>{order.id} #</button>
                                ) : ''
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
                                  {
                                    order.total.toLocaleString()
                                  }
                                  <small className='italic mr-1'>تومان</small>
                                </>
                              ) : '-'
                            }
                          </td>
                          <td className='tbody__tr__td w-2/12 text-sm'>
                            {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          ) : (
            <Alert
              theme={'danger'}
              title={'قطعه ای ثبت نشده است.'}
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
          <PortalModal closeHandler={() => {
            setModal({ show: false, order: {} })
            setOrderDesc('')
          }}>
            <ul className="w-[500px] max-h-[80vh] overflow-y-scroll rounded-md">
              {
                modal.order.status === 'pending' ? (
                  <li className='w-full flex justify-center items-center gap-1'>
                    <OrderStatusBtn
                      status={'working'}
                      isLoading={false}
                      clickHandler={() => {
                        setShowAcceptOrderModal(true)
                        setRepairmans(prev => {
                          const currentForOrderCity = prev.all.filter(repairman => {
                            if (repairman.city === modal.order.city) {
                              return repairman
                            }
                          })

                          return { ...prev, currentForOrderCity }
                        })
                      }}
                    >
                      تایید کردن
                    </OrderStatusBtn>
                  </li>
                ) : modal.order.status !== 'cancelled' && (
                  <li className='w-full flex justify-center items-center gap-1'>
                    <OrderStatusBtn
                      status={'cancelled'}
                      isLoading={false}
                      clickHandler={() => setShowCancelOrderModal(true)}
                    >
                      لغو تعمیر
                    </OrderStatusBtn>
                    <OrderStatusBtn
                      status={'done'}
                      isLoading={false}
                      clickHandler={() => setShowDoneOrderModal(true)}
                    >
                      اتمام تعمیر
                    </OrderStatusBtn>
                  </li>
                )
              }

              {
                modal.order.status === 'cancelled' && (
                  <li className='w-full flex justify-center items-center gap-1'>
                    <OrderStatusBtn
                      status={'pending'}
                      isLoading={paymentOrderStatusLoding.pending}
                      clickHandler={() => pendingOrderHandler(modal.order.id)}
                    >
                      تغییر به در انتظار تایید
                    </OrderStatusBtn>
                  </li>
                )
              }
              
              <OrderDetails order={modal.order} />
            </ul>
          </PortalModal>
        )
      }

      {
        (modal.show && showAcceptOrderModal) && (
          <PortalModal
            closeHandler={() => {
              setShowAcceptOrderModal(false)
              setRepairmans(prev => ({
                ...prev,
                currentForOrderCity: [],
                selected: {}
              }))
              setOrderDesc('')
              paymentAcceptInputRef.current.value = ''
            }}
            asAlert={true}
          >
            <form className='bg-white w-96 max-h-[80vh] p-6 rounded-xl overflow-y-auto'>
              {
                repairmans.currentForOrderCity.length > 0 ? (
                  <>
                    <label className='text-blue-500 block sansbold text-center'>
                      برای این سفارش یک تعمیرکار انتخاب کنید
                    </label>
                    <div className='w-full max-h-44 overflow-y-auto mt-3'>
                      {
                        repairmans.currentForOrderCity.map(repairman => (
                          <div
                            key={repairman.id}
                            className={`bg-blue-100 text-blue-500 w-full flex justify-center items-center 
                              p-3 mt-1 rounded-md cursor-pointer duration-100 first:mt-0
                              hover:bg-blue-500 hover:text-white active:scale-95
                              ${repairman.id === repairmans.selected.id && 'bg-blue-500 text-white'}`}
                            onClick={() => {
                              setRepairmans(prev => ({
                                ...prev,
                                selected: repairman
                              }))
                            }}
                          >
                            {
                              repairman.firstName + ' ' + repairman.lastName + ' - ' + repairman.phone
                            }
                          </div>
                        ))
                      }
                    </div>
                    <label className='text-blue-500 block sansbold text-center mt-6'>
                      آیا می خواهید قبل از تعمیر پیش پرداخت بگیرید؟
                    </label>
                    <div className='w-full bg-input mt-3'>
                      <input
                        className='input'
                        type="number"
                        inputMode='decimal'
                        placeholder='قیمت به تومان'
                        ref={paymentAcceptInputRef}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                      </svg>
                    </div>
                    <label
                      className='text-blue-500 block sansbold text-center mt-6'
                    >
                      آیا سفارش توضیحات دارد؟
                    </label>
                    <div className='w-full bg-textarea mt-3'>
                      <textarea
                        className='textarea'
                        placeholder='توضیحات را وارد کنید'
                        value={orderDesc}
                        onChange={event => setOrderDesc(event.target.value)}
                      >
                      </textarea>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-textarea">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                    </div>
                    <div className="w-full flex justify-center items-center gap-3 mt-3">
                      <SubmitBtn
                        customClass={'w-1/2'}
                        isLoading={paymentOrderStatusLoding.paymentAccept}
                        clickHandler={event => acceptOrderHandler(event, modal.order.id, 'payment-working')}
                      >
                        تایید قیمت
                      </SubmitBtn>
                      <SubmitBtn
                        type={'outline'}
                        customClass={'w-1/2'}
                        isLoading={paymentOrderStatusLoding.accept}
                        clickHandler={event => acceptOrderHandler(event, modal.order.id, 'working')}
                      >
                        خیر، ادامه
                      </SubmitBtn>
                    </div>
                  </>
                ) : (
                  <div className='bg-yellow-200 w-full h-40 flex flex-col justify-center items-center
                    gap-3 mx-auto rounded-xl'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-yellow-500 w-12 h-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span className='text-yellow-500 text-sm'>
                      هیچ تعمیر کاری برای این شهر وجود ندارد
                    </span>
                    <Link
                      className='text-yellow-500 text-sm underline hover:brightness-75'
                      to={'/admin/users'}
                    >
                      اضافه کردن تعمیرکار
                    </Link>
                  </div>
                )
              }
            </form>
          </PortalModal>
        )
      }

      {
        (modal.show && showCancelOrderModal) && (
          <PortalModal
            closeHandler={() => {
              setShowCancelOrderModal(false)
              setOrderDesc('')
            }}
            asAlert={true}
          >
            <form className='bg-white w-96 flex flex-col justify-center items-center gap-3 p-6 rounded-xl'>
              <label
                className='text-blue-500 sansbold text-center'
              >
                آیا سفارش توضیحات دارد؟
              </label>
              <div className='w-full bg-textarea'>
                <textarea
                  className='textarea'
                  placeholder='توضیحات را وارد کنید'
                  value={orderDesc}
                  onChange={event => setOrderDesc(event.target.value)}
                >
                </textarea>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-textarea">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              </div>
              <SubmitBtn
                type={'danger'}
                customClass={'w-full'}
                isLoading={paymentOrderStatusLoding.cancel}
                clickHandler={event => cancelOrderHandler(event, modal.order.id)}
              >
                لغو سفارش
              </SubmitBtn>
            </form>
          </PortalModal>
        )
      }

      {
        (modal.show && showDoneOrderModal) && (
          <PortalModal
            closeHandler={() => {
              setShowDoneOrderModal(false)
              setOrderDesc('')
              paymentDoneInputRef.current.value = ''
            }}
            asAlert={true}
          >
            <form className='bg-white w-96 flex flex-col justify-center items-center gap-3 p-6 rounded-xl'>
              <label
                className='text-blue-500 sansbold text-center'
                htmlFor="payment-input"
              >
                آیا می خواهید برای اتمام تعمیر هزینه بگیرید؟
              </label>
              <div className='w-full bg-input'>
                <input
                  className='input'
                  type="number"
                  inputMode='decimal'
                  placeholder='قیمت به تومان'
                  ref={paymentDoneInputRef}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <label
                className='text-blue-500 sansbold text-center'
              >
                آیا سفارش توضیحات دارد؟
              </label>
              <div className='w-full bg-textarea'>
                <textarea
                  className='textarea'
                  placeholder='توضیحات را وارد کنید'
                  value={orderDesc}
                  onChange={event => setOrderDesc(event.target.value)}
                >
                </textarea>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-textarea">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
              </div>
              <div className="w-full flex justify-center items-center gap-3">
                <SubmitBtn
                  customClass={'w-1/2'}
                  isLoading={paymentOrderStatusLoding.paymentAccept}
                  clickHandler={event => doneOrderHandler(event, modal.order.id, 'payment-done')}
                >
                  تایید قیمت
                </SubmitBtn>
                <SubmitBtn
                  type={'outline'}
                  customClass={'w-1/2'}
                  isLoading={paymentOrderStatusLoding.accept}
                  clickHandler={event => doneOrderHandler(event, modal.order.id, 'done')}
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

export default AdminOrders