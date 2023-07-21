import React from 'react'

import { baseURL } from "../../../config.json"

function OrderDetails({ order }) {
  return (
    <>
      <li className='w-full flex justify-center items-center rounded-md mt-1'>
        <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
          کد سفارش
        </div>
        <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
          {order.id} #
        </div>
      </li>

      <li className='w-full flex justify-center items-center rounded-md mt-1'>
        <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
          وضعیت
        </div>
        <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
          {
            order.status === 'pending' ? 'در انتظار تعمیر'
              : order.status === 'working' ? 'تایید شده'
                : order.status === 'cancelled' ? 'لغو شده'
                  : order.status === 'done' ? 'انجام شده'
                    : order.status === 'payment-working' ? 'تایید شده - در انتظار پرداخت'
                      : order.status === 'payment-done' ? 'انجام شده - در انتظار پرداخت'
                        : ''
          }
        </div>
      </li>

      <li className='w-full flex justify-center items-center rounded-md mt-1'>
        <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
          پرداخت شده
        </div>
        <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
          {
            order.total ? (
              <>
                {order.total.toLocaleString()}
                <small className='italic mr-1'>تومان</small>
              </>
            ) : '-'
          }
        </div>
      </li>

      <li className='w-full flex justify-center items-center rounded-md mt-1'>
        <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
          در انتظار پرداخت
        </div>
        <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
          {
            order.transactions.filter(action => action.status === 'pending')[0] ? (
              <>
                {
                  order.transactions.filter(action => action.status === 'pending').map(action => action.price).reduce((prev, current) => prev + current).toLocaleString()
                }
                <small className='italic mr-1'>تومان</small>
              </>
            ) : '-'
          }
        </div>
      </li>

      <li className='w-full flex justify-center items-center rounded-md mt-1'>
        <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
          کاربر
        </div>
        <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
          {
            `${order.user.firstName} ${order.user.lastName} - ${order.user.phone}`
          }
        </div>
      </li>

      <li className='w-full flex justify-center items-center rounded-md mt-1'>
        <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
          تعمیر کننده
        </div>
        <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
          {
            order.repairmanId ?
              `${order.repairman.firstName} ${order.repairman.lastName} - ${order.repairman.phone}`
              : '-'
          }
        </div>
      </li>

      <li className='w-full flex justify-center items-center rounded-md mt-1'>
        <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
          دستگاه
        </div>
        <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
          {order.phoneName}
        </div>
      </li>

      <li className='w-full flex justify-center items-center rounded-md mt-1'>
        <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
          قطعه
        </div>
        <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
          {order.partName}
        </div>
      </li>

      <li className='w-full flex justify-center items-center rounded-md mt-1'>
        <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
          تاریخ
        </div>
        <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
          {new Date(order.createdAt).toLocaleDateString('fa-IR')}
        </div>
      </li>

      <li className='w-full flex justify-center items-center rounded-md mt-1'>
        <div className="bg-blue-100 text-blue-500 w-4/12 p-3 rounded-r-md text-center">
          تصویر
        </div>
        <div className="bg-white w-8/12 flex justify-center items-center p-3 rounded-l-md">
          <a
            className='underline'
            href={`${baseURL}/uploads/${order.picture}`}
            target='_blank'
          >
            مشاهده
          </a>
        </div>
      </li>

      <li className='w-full flex flex-col justify-center items-center rounded-md mt-1'>
        <div className="bg-blue-100 text-blue-500 w-full p-3 rounded-t-md text-center">
          پیام پشتیبانی
        </div>
        <div className="bg-white w-full flex justify-center items-center p-3 rounded-b-md
          text-center break-all">
          {
            order.adminMessage || '-'
          }
        </div>
      </li>

      <li className='w-full flex flex-col justify-center items-center rounded-md mt-1 '>
        <div className="bg-blue-100 text-blue-500 w-full p-3 rounded-t-md text-center">
          توضیحات
        </div>
        <div className="bg-white w-full flex justify-center items-center p-3 rounded-b-md
          text-center break-all">
          {order.description}
        </div>
      </li>

      <li className='w-full flex flex-col justify-center items-center rounded-md mt-1'>
        <div className="bg-blue-100 text-blue-500 w-full p-3 rounded-t-md text-center">
          آدرس
        </div>
        <div className="bg-white w-full flex justify-center items-center p-3 rounded-b-md
          text-center break-all">
          {order.address}
        </div>
      </li>
    </>
  )
}

export default OrderDetails