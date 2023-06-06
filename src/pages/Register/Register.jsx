import React, { useEffect, useRef, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';

import { get, post } from '../../utility'
import AuthContext from '../../context/AuthContext';

export default function Register() {
  const authcontext = useContext(AuthContext)

  const [cities, setCities] = useState([])
  const navigate = useNavigate()

  const [formPage, setFormPage] = useState('login')
  const [prevPage, setPrevPage] = useState('login')

  const loginPhoneRef = useRef()

  const signinNameRef = useRef()
  const signinLastNameRef = useRef()
  const signinPhoneRef = useRef()
  const signinCityRef = useRef()

  const otpNumberRef = useRef()

  const mobileHomeRef = useRef()

  useEffect(() => {
    get('/list/cities').then(response => {
      setCities(response.data)
    })
  }, [])

  useEffect(() => {
    mobileHomeRef.current.classList.remove('show-up')
    setTimeout(() => {
      mobileHomeRef.current.classList.add('show-up')
    }, 0);
  }, [formPage])

  function generateLoginOtp() {
    otpNumberRef.current.value = ''
    post('/auth?action=generate&mode=login', { phone: loginPhoneRef.current.value }).then(response => {
      toast.success(`کد تایید ارسال شد`)
      response.data.nextPage && setFormPage('otpPage')
    }).catch((err) => {
      toast(err.data.err, {
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
            className="bg-yellow-300 stroke-white w-7 h-7 p-1 rounded-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        )
      })
      err.data.nextPage && setFormPage('otpPage')
    })
  }

  function submitLogin() {
    if (loginPhoneRef.current.value.length !== 11 || !loginPhoneRef.current.value.startsWith('09')) {
      toast.error('لطفا شماره خود را به درستی وارد کنید!')
    } else {
      setPrevPage('login')
      generateLoginOtp()
    }
  }

  function generateSigninOtp() {
    otpNumberRef.current.value = ''

    post('/auth?action=generate&mode=register', { phone: signinPhoneRef.current.value }).then(response => {
      toast.success(`کد تایید ارسال شد`)
      response.data.nextPage && setFormPage('otpPage')
    }).catch(err => {
      toast(err.data.err, {
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
            className="bg-yellow-300 stroke-white w-7 h-7 p-1 rounded-full">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        )
      })
      err.data.nextPage && setFormPage('otpPage')
    })
  }

  function submitSignin() {
    if (
      signinNameRef.current.value.length < 3
      || signinLastNameRef.current.value.length < 3
      || signinPhoneRef.current.value.length !== 11
      || !signinPhoneRef.current.value.startsWith('09')
      || signinCityRef.current.value === 'none'
    ) toast.error('لطفا فیلد هارا به درستی کامل کنید!')
    else {
      setPrevPage('signin')
      generateSigninOtp()
    }
  }

  async function otpSubmit() {
    const isLogin = prevPage === 'login'

    if (otpNumberRef.current.value.length !== 4) return toast.error('لطفا کد را کامل وارد کنید!')

    post(`/auth?action=submit&mode=${isLogin ? 'login' : 'register'}`, {
      code: otpNumberRef.current.value,
      phone: isLogin ? loginPhoneRef.current.value : signinPhoneRef.current.value,
      mode: isLogin ? 'login' : 'register'
    }).then(async (response) => {
      let token = response.data.token || null
      let userData = response.data.user || null

      if (!isLogin) {
        await post(`/register`, {
          firstName: signinNameRef.current.value.trim(),
          lastName: signinLastNameRef.current.value.trim(),
          phone: signinPhoneRef.current.value,
          city: signinCityRef.current.value.trim()
        }).then((response) => {
          token = response.data.token
          userData = response.data.user
        }).catch(err => {
          toast.error(err.data.err)
        })
      }

      authcontext.login(token, userData)
      navigate('/')
    }).catch(err => {
      toast.error(err.data.err)
    })

  }

  return (
    <div className="w-screen h-screen flex">
      <div className="w-full h-full flex flex-col justify-center items-center relative
        md:w-1/2">
        <div className="w-full p-3 flex justify-between items-center absolute top-0
          md:justify-center">
          <div className={`${formPage === 'login' ? 'flex' : 'hidden'} bg-title title-blue show-up`}>
            ورورد به حساب قبلی
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div className={`${formPage === 'signin' ? 'flex' : 'hidden'} bg-title title-blue show-up`}>
            ساخت حساب کاربری
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <div className={`${formPage === 'otpPage' ? 'flex' : 'hidden'} bg-title title-blue show-up`}>
            تایید کد یکبار مصرف
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <Link to={'/'}
            className={`border border-blue-500 w-11 h-11 flex justify-center items-center rounded-full      
            show-up
            md:hidden`}
            ref={mobileHomeRef}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-blue-500 w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </Link>
        </div>

        <div className={`${formPage === 'login' ? 'flex' : 'hidden'}
          w-full flex flex-col justify-center items-center gap-3 p-6 show-up`}>
          <div className='w-full bg-input'>
            <input className='input tracking-[0.25rem] text-right' dir='ltr'
              type="number" placeholder='09*********' ref={loginPhoneRef} />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </div>
          <button className='btn btn-blue w-full'
            onClick={submitLogin}>ورود</button>
          <span className='text-xs flex justify-center items-center gap-2 mt-1 show-up a-slow'>
            حساب کاربری ندارید؟
            <span className='text-blue-500 cursor-pointer select-none'
              onClick={() => setFormPage('signin')}>ثبت نام کنید</span>
          </span>
        </div>

        <div className={`${formPage === 'signin' ? 'flex' : 'hidden'}
          w-full flex flex-col justify-center items-center gap-3 p-6 show-up`}>
          <div className='w-full bg-input'>
            <input
              className='input'
              type="text"
              placeholder='نام'
              ref={signinNameRef}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div className='w-full bg-input'>
            <input
              className='input'
              type="text"
              placeholder='نام خانوادگی'
              ref={signinLastNameRef}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div className='w-full bg-input'>
            <input
              className='input tracking-[0.25rem] text-right' dir='ltr'
              type="number"
              placeholder='09*********'
              ref={signinPhoneRef}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </div>
          <div className='w-full bg-input'>
            <select className='select-box' ref={signinCityRef}>
              <option value="none">شهرتان را انتخاب کنید</option>
              {
                cities.map(city => (
                  <option key={city.id} value={city.name}>{city.name}</option>
                ))
              }
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <button className='btn btn-blue w-full'
            onClick={submitSignin}>ثبت نام</button>
          <span className='text-xs flex justify-center items-center gap-2 mt-1 show-up a-slow'>
            حساب کاربری دارید؟
            <span className='text-blue-500 cursor-pointer select-none'
              onClick={() => setFormPage('login')}>وارد شوید</span>
          </span>
        </div>

        <div className={`${formPage === 'otpPage' ? 'flex' : 'hidden'}
          w-full flex flex-col justify-center items-center gap-3 p-6 show-up`}>
          <div className='w-full bg-input'>
            <input className='input tracking-[0.25rem] placeholder:tracking-normal'
              type="number" placeholder='کد 4 رقمی را وارد کنید' ref={otpNumberRef} />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <button className='btn btn-blue w-full' onClick={otpSubmit}>ثبت کد</button>
          <span className='text-xs flex justify-center items-center gap-2 mt-1 show-up a-slow'>
            شماره خود را اشتباه وارد کرده اید؟
            {
              prevPage === 'login' ? (
                <span className='text-blue-500 cursor-pointer select-none'
                  onClick={() => setFormPage('login')}>بازگشت به صفحه ورود</span>
              ) : (
                <span className='text-blue-500 cursor-pointer select-none'
                  onClick={() => setFormPage('signin')}>بازگشت به صفحه ثبت نام</span>
              )
            }
          </span>
          <span className='text-xs flex justify-center items-center gap-2 show-up'>
            کدی دریافت نکردید؟
            <button
              className='text-blue-500 cursor-pointer select-none'
              onClick={generateLoginOtp}
            >
              دریافت دوباره
            </button>
          </span>
        </div>
      </div>

      <div className="bg-blue-500 w-1/2 h-full hidden flex-col justify-between items-center pt-6 relative
        md:flex">
        <img className='h-full w-full object-cover absolute top-0 z-10 brightness-50'
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
      <Toaster />
    </div>
  )
}