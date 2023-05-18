import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
  const [register, setRegister] = useState('login')

  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/2 h-full flex justify-center items-center">
        <form className='w-full flex flex-col justify-center items-center gap-3 p-6'>
          <div className='w-full bg-input'>
            <input className='input'
              type="text" placeholder='شماره تماس' />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </div>
          <button className='btn btn-blue w-full'>ورود</button>
        </form>
      </div>
      <div className="bg-blue-500 w-1/2 h-full flex flex-col justify-between items-center pt-6 relative">
        <img className='h-full object-fill absolute top-0 z-10 brightness-50'
          src="https://ariavash.ir/fa/storage/2020/09/%D8%AA%D8%B9%D9%85%DB%8C%D8%B1%D8%A7%D8%AA-%D9%85%D9%88%D8%A8%D8%A7%DB%8C%D9%84-%D8%A8%D8%A7%D8%B2%D8%A7%D8%B1-%DA%A9%D8%A7%D8%B1-1200x900.jpg" alt="repair" />
        <Link to='/' className='btn btn-out-white z-20'>
          بازگشت به صفحه اصلی
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
            <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </Link>
        <div className="bg-white text-white backdrop-blur-md bg-opacity-10 w-full text-justify p-9 z-20">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع.
        </div>
      </div>
    </div>
  )
}