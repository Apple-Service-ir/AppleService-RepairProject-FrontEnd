import React, { useState } from 'react'

export default function Register() {
  const [register, setRegister] = useState('login')

  return (
    <div className='container flex flex-col justify-center items-center gap-3 mx-auto mt-7 px-3
    sm:p-0'>
      <div className="bg-blue-500 text-white w-full flex flex-col-reverse justify-center gap-3 rounded-xl p-5
        sm:w-3/4 md:flex-row">
        {
          register === 'login' ? (
            <form className="w-full h-full flex flex-col items-center gap-3
              md:w-1/2">
              <input className='bg-white bg-opacity-0 border border-white placeholder:text-white w-full px-5 py-2 rounded-md
                hover:bg-opacity-25 focus:outline-none focus:bg-opacity-25 focus:border-2'
                type="text" placeholder='شماره تماس' />
              <button className='btn btn-white w-full rounded-md'>ورود</button>
            </form>
          ) : (
            <form className="w-full h-full flex flex-col items-center gap-3
              md:w-1/2">
              <input className='bg-white bg-opacity-0 border border-white placeholder:text-white w-full px-5 py-2 rounded-md
                hover:bg-opacity-25 focus:outline-none focus:bg-opacity-25 focus:border-2'
                type="text" placeholder='نام' />
              <input className='bg-white bg-opacity-0 border border-white placeholder:text-white w-full px-5 py-2 rounded-md
                hover:bg-opacity-25 focus:outline-none focus:bg-opacity-25 focus:border-2'
                type="text" placeholder='نام خانوادگی' />
              <input className='bg-white bg-opacity-0 border border-white placeholder:text-white w-full px-5 py-2 rounded-md
                hover:bg-opacity-25 focus:outline-none focus:bg-opacity-25 focus:border-2'
                type="text" placeholder='شماره تماس' />
              <button className='btn btn-white w-full rounded-md'>ثبت نام</button>
            </form>
          )
        }
        <div className="w-full h-full flex flex-col items-center gap-6 mb-6
          md:w-1/2 md:mb-0">
          <h1 className='text-3xl sansbold'>
            {
              register === 'login' ? 'ورود به حساب قبلی' : 'ساخت حساب کاربری'
            }
          </h1>
          <p className='text-justify px-7 opacity-75'>
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع
          </p>
          <button className='btn btn-outline-white' onClick={() => {
            register === 'login' ? setRegister('signin') : setRegister('login')
          }}>
            {
              register === 'login' ? 'ساخت حساب کاربری' : 'ورود به حساب قبلی'
            }
          </button>
        </div>
      </div>
    </div>
  )
}