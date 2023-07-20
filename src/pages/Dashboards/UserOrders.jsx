import React, { useContext, useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

import { get, post } from '../../utility'
import AuthContext from './../../context/AuthContext'
import LoadingContext from './../../context/LoadingContext'
import Alert from '../../components/Alert/Alert'
import PortalModal from '../../components/PortalModal/PortalModal'
import OrderDetails from '../../components/OrderDetails/OrderDetails'
import OrderStatusBox from '../../components/OrderStatusBox/OrderStatusBox'

function UserOrders() {
  const authContext = useContext(AuthContext)
  const loadingContext = useContext(LoadingContext)

  const [allOrders, setAllOrders] = useState(
    { all: [], pending: {}, working: {}, paymentWoring: {}, paymentDone: {} }
  )
  const [modal, setModal] = useState({ show: false, order: {} })

  useEffect(() => {
    if (authContext.userToken) {
      document.title = "سفارشات - داشبورد اپل سرویس"
      get(`/orders/log?token=${authContext.userToken}`)
        .then((response) => {
          console.log(response)
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
            <OrderStatusBox
              order={allOrders.pending}
              clickHandler={() => cancelOrder(allOrders.pending.id)}
            />
          )
        }

        {
          Object.keys(allOrders.working).length > 0 && (
            <OrderStatusBox
              order={allOrders.working}
            />
          )
        }

        {
          Object.keys(allOrders.paymentWoring).length > 0 && (
            <OrderStatusBox
              order={allOrders.paymentWoring}
              clickHandler={() => workingPayHandler(allOrders.paymentWoring.id)}
            />
          )
        }

        {
          Object.keys(allOrders.paymentDone).length > 0 && (
            <OrderStatusBox
              order={allOrders.paymentDone}
              clickHandler={() => donePayHandler(allOrders.paymentDone.id)}
            />
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
              <OrderDetails order={modal.order} />
            </ul>
          </PortalModal>
        )
      }

      <Toaster />
    </>
  )
}

export default UserOrders