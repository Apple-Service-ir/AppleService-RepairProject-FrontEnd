import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { getMe } from '../../utility'

export function Header() {
  const [userCookie, setUserCookie] = useState({})

  useEffect(() => {
    getMe().then(response => {
      response && setUserCookie(response)
    })
  }, [])

  return (
    <>
      <div className='bg-blue-500 w-screen flex justify-between items-center p-3 px-7 z-50'>
        <div className="btn btn-ghost text-xl flex items-center relative lg:hidden group">
          <svg className="stroke-white w-9 h-9 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
          <ul className="bg-white shadow-md shadow-[#25252545] w-max flex flex-col justify-center items-center gap-7 p-5 px-3 rounded-xl z-50
            absolute top-[140%] right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible" id='mobileMenu'>
            <li>
              <NavLink to='/' className='bg-slate-200 text-blue-500 p-2 px-10 rounded-md'>صفحه اصلی</NavLink>
            </li>
            <li>
              <NavLink to='/order' className='bg-slate-200 text-blue-500 p-2 px-10 rounded-md'>صفحه اصلی</NavLink>
            </li>
            <li>
              <NavLink className='bg-slate-200 text-blue-500 p-2 px-10 rounded-md'>صفحه اصلی</NavLink>
            </li>
            <li>
              <NavLink className='bg-slate-200 text-blue-500 p-2 px-10 rounded-md'>صفحه اصلی</NavLink>
            </li>
            <li>
              <NavLink className='bg-slate-200 text-blue-500 p-2 px-10 rounded-md'>صفحه اصلی</NavLink>
            </li>
          </ul>
        </div>
        <ul className='hidden justify-center items-center gap-9 lg:flex'>
          <li>
            <NavLink to='/'
              className={link => link.isActive ? 'header__navlink-active' : 'header__navlink'}>
              صفحه اصلی
            </NavLink>
          </li>
          <li>
            <NavLink to='/order'
              className={link => link.isActive ? 'header__navlink-active' : 'header__navlink'}>
              ثبت سفارش
            </NavLink>
          </li>
          <li>
            <NavLink to='/contact-us'
              className={link => link.isActive ? 'header__navlink-active' : 'header__navlink'}>
              ارتباط با ما
            </NavLink>
          </li>
          <li>
            <NavLink to='/report'
              className={link => link.isActive ? 'header__navlink-active' : 'header__navlink'}>
              ثبت شکایات
            </NavLink>
          </li>
        </ul>
        {
          userCookie ? (
            <NavLink
              className={link => link.isActive ? 'btn btn-white' : 'btn btn-out-white'}
              to='/dashboard'
            >
              {userCookie.firstName} {userCookie.lastName}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-5 h-5">
                <path className="duration-0" strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </NavLink>
          ) : (
            <NavLink className='btn btn-out-white' to='/register'>ثبت نام / ورورد</NavLink>
          )
        }
      </div>
    </>
  )
}