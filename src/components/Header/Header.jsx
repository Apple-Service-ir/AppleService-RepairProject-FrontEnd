import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import Btn from '../Btn/Btn'

export function Header() {
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
        <ul className='hidden justify-center items-center gap-7 lg:flex'>
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
            <NavLink to='/about-us'
              className={link => link.isActive ? 'header__navlink-active' : 'header__navlink'}>
              درباره ما
            </NavLink>
          </li>
          <li>
            <NavLink to='/report'
              className={link => link.isActive ? 'header__navlink-active' : 'header__navlink'}>
              ثبت شکایات
            </NavLink>
          </li>
        </ul>
        <Btn
          type='link'
          href='/'
          bgColor='bg-blue-500'
          color='text-white'
          border='border border-white'
          hoverBgColor='hover:bg-white'
          hoverColor='hover:text-blue-500'
          text='ثبت نام / ورود'
        />
      </div>
    </>
  )
}