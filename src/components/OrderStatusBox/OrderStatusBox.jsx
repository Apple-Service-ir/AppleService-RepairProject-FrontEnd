import React from 'react'

function OrderStatusBox({ order, clickHandler }) {
  let bg = null
  let idBg = null
  let bgStatus = null
  let idShadow = null
  let statusShadow = null
  let border = null
  let btn = null

  switch (order.status) {
    case 'pending': {
      bg = 'bg-blue-200'
      idBg = 'bg-blue-300'
      bgStatus = 'bg-blue-500'
      idShadow = 'shadow-sm shadow-blue-500'
      statusShadow = 'shadow shadow-blue-700'
      border = 'border-b-2 border-dashed border-blue-300'
      btn = 'badge-danger'
      break;
    }

    case 'working': {
      bg = 'bg-yellow-200'
      idBg = 'bg-yellow-300'
      bgStatus = 'bg-yellow-500'
      idShadow = 'shadow-sm shadow-yellow-500'
      statusShadow = 'shadow shadow-yellow-700'
      border = 'border-b-2 border-dashed border-yellow-300'
      btn = 'badge-warning'
      break;
    }

    case 'payment-working': {
      bg = 'bg-yellow-200'
      idBg = 'bg-yellow-300'
      bgStatus = 'bg-yellow-500'
      idShadow = 'shadow-sm shadow-yellow-500'
      statusShadow = 'shadow shadow-yellow-700'
      border = 'border-b-2 border-dashed border-yellow-300'
      btn = 'badge-warning'
      break;
    }

    case 'payment-done': {
      bg = 'bg-green-200'
      idBg = 'bg-green-300'
      bgStatus = 'bg-green-500'
      idShadow = 'shadow-sm shadow-green-500'
      statusShadow = 'shadow shadow-green-700'
      border = 'border-b-2 border-dashed border-green-300'
      btn = 'badge-success'
      break;
    }

    default: {
      bg = null
      idBg = null
      bgStatus = null
      idShadow = null
      statusShadow = null
      border = null
      btn = null
      break;
    }
  }

  return (
    <div className={`${bg} w-full flex flex-col justify-center items-center gap-3
      rounded-xl p-3`}>
      <div className={`${idBg} flex justify-center items-center gap-3 py-2
        rounded-full relative ${idShadow}
        ${['payment-working', 'payment-done'].includes(order.status) ? 'px-20' : 'px-9'}`}>
        <span>کد سفارش:</span>
        <button className='flex justify-center items-center relative group'>
          <span>#{order.id}</span>
          <span className='tooltip'>کپی کنید!</span>
        </button>
        <div className={`${bgStatus} text-white w-3/4 text-center text-xs p-0.5 rounded-b-full
          absolute top-full ${statusShadow}`}>
          {
            order.status === 'pending' ? 'در انتظار تایید'
              : order.status === 'working' ? 'در حال انجام'
                : (order.status === 'working' && order.total) ? 'در حال انجام - پرداخت شده'
                  : order.status === 'payment-working' ? 'در حال انجام - در انتظار پرداخت'
                    : order.status === 'payment-done' ? 'تمام شده - در انتظار پرداخت'
                      : ''
          }
        </div>
      </div>
      <ul className='w-full flex flex-col mt-6'>
        {
          ['working', 'payment-working', 'payment-done'].includes(order.status) && (
            <li className={`${border} w-full flex gap-3 p-3`}>
              <span className='sansbold'>پرداخت شده:</span>
              <p className='text-sm break-all'>
                {
                  order.total ? (
                    <>
                      {
                        order.total.toLocaleString()
                      }
                      <small className='italic mr-1'>تومان</small>
                    </>
                  ) : '...'
                }
              </p>
            </li>
          )
        }

        {
          ['working', 'payment-working', 'payment-done'].includes(order.status) && (
            <li className={`${border} w-full flex gap-3 p-3`}>
              <span className='sansbold'>در انتظار پرداخت:</span>
              <p className='text-sm break-all'>
                {
                  order.transactions.filter(action => action.status === 'pending')[0] ? (
                    <>
                      {
                        order.transactions.filter(action => action.status === 'pending').map(action => action.price).reduce((prev, current) => prev + current).toLocaleString()
                      }
                      <small className='italic mr-1'>تومان</small>
                    </>
                  ) : '...'
                }
              </p>
            </li>
          )
        }

        <li className={`${border} w-full flex gap-3 p-3`}>
          <span className='sansbold'>نام دستگاه:</span>
          <p className='text-sm break-all'>{order.phoneName}</p>
        </li>

        <li className={`${border} w-full flex gap-3 p-3`}>
          <span className='sansbold'>قطعات:</span>
          <p className='text-sm break-all'>{order.partName}</p>
        </li>

        <li className={`${border} w-full flex gap-3 p-3`}>
          <span className='sansbold'>توضیحات:</span>
          <p className='text-sm break-all'>{order.description}</p>
        </li>

        <li className={`${border} w-full flex gap-3 p-3`}>
          <span className='sansbold'>آدرس:</span>
          <p className='text-sm break-all'>{order.address}</p>
        </li>

        <li className={`w-full flex gap-3 p-3`}>
          <span className='sansbold'>پیام پشتیبانی:</span>
          <p className='text-sm break-all'>{order.adminMessage || '...'}</p>
        </li>
      </ul>
      {
        (
          ['pending', 'payment-working', 'payment-done'].includes(order.status)
          && !location.pathname.includes('repairman')
        ) && (
          <button
            className={`badge-btn ${btn}`}
            onClick={clickHandler}
          >
            {
              order.status === 'pending' ? 'لغو سفارش'
                : 'پرداخت'
            }
          </button>
        )
      }
    </div >
  )
}

export default OrderStatusBox