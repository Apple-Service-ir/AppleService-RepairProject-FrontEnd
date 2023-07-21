import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { post } from '../../utils/connection'
import TransActionBox from '../../components/TransActionBox/TransActionBox'

function TransActionResponse() {
  const [searchParams] = useSearchParams()
  const [order, setOrder] = useState({})
  const [orderStatus, setOrderStatus] = useState(false)

  useEffect(() => {
    const status = searchParams.get('Status')
    const authority = searchParams.get('Authority')
    if (status === 'OK') {
      setOrderStatus(true)
      post('/payments/verify', _, { authority })
        .then(response => {
          setOrder(response.data.order)
        })
        .catch(error => {
          console.error(error.response.data)
          setOrderStatus(false)
        })
    }
  }, [])

  return (
    <div className='w-screen h-screen'>
      <div className="w-full h-16 flex justify-center items-end">
        <a
          className='btn btn-blue'
          href="/dashboard/orders"
        >
          بازگشت به سایت
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
          </svg>
        </a>
      </div>
      <div className="current-screen-height w-full flex justify-center items-center">
        <TransActionBox
          status={orderStatus}
          order={order}
        />
      </div>
    </div>
  )
}

export default TransActionResponse