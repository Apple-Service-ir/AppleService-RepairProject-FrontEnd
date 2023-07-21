import React from 'react'

function NotFound() {
  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
      <img
        className='w-96 h-48 object-cover'
        src="./../../../public/images/not-found.png"
        alt="404 not found"
      />
      <h1>
        صفحه مورد نطر پیدا نشد
      </h1>
      <a
        className='text-blue-500 underline mt-6'
        href="/"
      >
        بازگشت به سایت
      </a>
    </div>
  )
}

export default NotFound