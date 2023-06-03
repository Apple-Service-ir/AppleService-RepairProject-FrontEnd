import React, { useContext, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

import AuthContext from '../../context/AuthContext'
import { get } from '../../utility'
import PortalModal from '../../components/PortalModal/PortalModal'

function AdminOrders() {
  const authContext = useContext(AuthContext)

  const [orders, setOrders] = useState([])
  const [modal, setModal] = useState({ show: false, order: {} })

  useEffect(() => {
    get(`/admins/orders/all?token=${authContext.userToken}`)
      .then(response => {
        if (response.data.ok) {
          setOrders(response.data.orders)
        }
        console.log(response.data);
      })
  }, [authContext])

  return (
    <div className='w-full h-full flex flex-col items-center'>
      <h1 className='w-full text-right text-xl sansbold mt-6'>لیست کاربران</h1>
      <div className="w-full rounded-xl overflow-x-scroll mt-3
        lg:overflow-hidden">
        {
          orders.length > 0 && (
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
                          onClick={() => {
                            setModal({ show: true, order: order })
                          }}
                        >
                          <td className='tbody__tr__td w-2/12'>
                            <div className='td__wrapper justify-center'>
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
          )
        }
      </div>
      {
        modal.show && createPortal(
          <PortalModal closeHandler={() => setModal({ show: false, order: {} })}>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia, nam?</p>
          </PortalModal>,
          document.body
        )
      }
    </div >
  )
}

export default AdminOrders