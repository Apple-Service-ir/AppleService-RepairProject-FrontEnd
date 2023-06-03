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
            <ul className="w-96 max-h-[80vh] overflow-y-scroll">
              <li className='w-full flex justify-center items-center rounded-xl'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-xl text-center">
                  کد سفارش
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-xl">
                  {modal.order.id} #
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-xl mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-xl text-center">
                  وضعیت
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-xl">
                  {
                    modal.order.status === 'pending' ? 'در انتظار تعمیر'
                      : modal.order.status === 'working' ? 'تایید شده'
                        : modal.order.status === 'cancelled' ? 'لغو شده'
                          : modal.order.status === 'done' ? 'انجام شده'
                            : ''
                  }
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-xl mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-xl text-center">
                  کاربر
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-xl">
                  {modal.order.user.firstName} {modal.order.user.lastName}
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-xl mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-xl text-center">
                  تعمیر کننده
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-xl">
                  {
                    modal.order.repairMan ?
                      `${modal.order.repairMan.firstName} ${modal.order.repairMan.firstName}`
                      : '-'
                  }
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-xl mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-xl text-center">
                  دستگاه
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-xl">
                  {modal.order.phoneName}
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-xl mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-xl text-center">
                  قطعه
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-xl">
                  {modal.order.partName}
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-xl mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-xl text-center">
                  تاریخ
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-xl">
                  {new Date(modal.order.createdAt).toLocaleDateString('fa-IR')}
                </div>
              </li>

              <li className='w-full flex justify-center items-center rounded-xl mt-1'>
                <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-xl text-center">
                  قیمت
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-xl">
                  {
                    modal.order.total ? (
                      <>
                        39,000,000
                        <small className='italic opacity-75 mx-1'>تومان</small>
                      </>
                    ) : '-'
                  }
                </div>
              </li>

              <li className='w-full flex flex-col justify-center items-center rounded-xl mt-1'>
                <div className="bg-blue-100 text-blue-500 w-full p-3 rounded-t-xl text-center">
                  آدرس
                </div>
                <div className="bg-white w-full flex justify-center items-center p-3 rounded-b-xl
                  text-center">
                  {modal.order.address}
                </div>
              </li>
              <li className='w-full flex flex-col justify-center items-center rounded-xl mt-1 '>
                <div className="bg-blue-100 text-blue-500 w-full p-3 rounded-t-xl text-center">
                  توضیحات
                </div>
                <div className="bg-white w-full flex justify-center items-center p-3 rounded-b-xl
                  text-center">
                  {modal.order.description}
                </div>
              </li>
            </ul>
          </PortalModal>,
          document.body
        )
      }
    </div >
  )
}

export default AdminOrders