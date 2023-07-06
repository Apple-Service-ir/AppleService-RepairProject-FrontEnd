import React, { useContext, useEffect, useState } from 'react'

import { mainUrl } from '../../../config.json'
import AuthContext from '../../context/AuthContext'
import LoadingContext from '../../context/LoadingContext'
import { get } from '../../utility'
import Alert from '../../components/Alert/Alert'
import PortalModal from '../../components/PortalModal/PortalModal'

function RepairManDoneOrders() {
  const authContext = useContext(AuthContext)
  const loadingContext = useContext(LoadingContext)

  const [orders, setOrders] = useState([])
  const [modal, setModal] = useState({ show: false, order: {} })

  useEffect(() => {
    if (authContext.userToken) {
      loadingContext.setProgressIsLoadingHandler(true)
      get(`/repairmans/orders/get?token=${authContext.userToken}`)
        .then(response => {
          const currentOrders = response.data.orders.filter(order => order.repairmanId === authContext.userInfo.id)
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
                                  {modal.order.total}
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
                    })
                  }
                </tbody>
              </table>
            </div>
          ) : (
            <Alert
              theme={'danger'}
              title={'سفارشی پیدا نشد.'}
              icon={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
            />
          )
        }
      </div>

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
                  مشتری
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {
                    `${modal.order.user.firstName} ${modal.order.user.lastName} - ${modal.order.user.phone}`
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
                  در انتظار پرداخت
                </div>
                <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
                  {
                    modal.order.transactions.filter(action => action.status === 'pending').map(action => action.price).reduce((prev, current) => prev + current).toLocaleString()
                  }
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
    </>
  )
}

export default RepairManDoneOrders