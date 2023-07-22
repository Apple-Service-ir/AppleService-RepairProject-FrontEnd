import React, { useContext, useEffect, useState } from 'react'

import AuthContext from '../../context/AuthContext'
import LoadingContext from '../../context/LoadingContext'
import { get } from '../../utils/connection'
import Alert from '../../components/Alert/Alert'
import PortalModal from '../../components/PortalModal/PortalModal'
import OrderDetails from '../../components/OrderDetails/OrderDetails'

function RepairManDoneOrders() {
  const authContext = useContext(AuthContext)
  const loadingContext = useContext(LoadingContext)

  const [orders, setOrders] = useState([])
  const [modal, setModal] = useState({ show: false, order: {} })

  useEffect(() => {
    if (authContext.userToken) {
      get('/repairmans/orders/get', authContext.userToken)
        .then(response => {
          console.log(response.data.orders)
          const currentOrders = response.data.orders.filter(
            order => order.repairmanId === authContext.userInfo.id && order.status === 'done'
          )
          setOrders(currentOrders)
        })
        .finally(() => loadingContext.setProgressIsLoadingHandler(false))
    }
  }, [authContext.userToken])

  return (
    <>
      <div className='w-full flex flex-col justify-center items-center gap-6 
        show-fade'>
        {
          orders.length > 0 ? (
            <div className="w-full overflow-x-auto rounded-xl mt-3">
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
                          onClick={() => {
                            setModal({ show: true, order })
                          }}
                        >
                          <td className='tbody__tr__td w-2/12'>
                            <div className='td__wrapper justify-center'>
                              <button className='badge badge-success select-text'>{order.id} #</button>
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
                                  {order.total.toLocaleString()}
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
              title={'سفارشی ثبت نشده است'}
            />
          )
        }
      </div>

      {
        modal.show && (
          <PortalModal closeHandler={() => setModal({ show: false, order: {} })}>
            <ul className="w-[500px] max-h-[80vh] overflow-y-scroll rounded-md">
              <OrderDetails order={modal.order} />
            </ul>
          </PortalModal>
        )
      }
    </>
  )
}

export default RepairManDoneOrders