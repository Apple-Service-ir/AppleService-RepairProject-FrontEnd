import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import Btn from '../Btn/Btn'
import "./Header.css"

export function Header() {
  return (
    <>
      <div className='bg-blue-500 w-screen h-20 flex justify-between items-center px-5 z-50
        sm:px-10'>
        <div className="btn btn-ghost text-xl flex items-center relative lg:hidden group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-white w-9 h-9 cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>

          <ul className="bg-white shadow-md shadow-[#25252545] w-max flex flex-col justify-center items-center gap-7 p-5 px-3 rounded-xl z-50
            absolute top-[140%] right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible" id='mobileMenu'>
            <li>
              <NavLink className='bg-slate-200 text-blue-500 p-2 px-10 rounded-md'>صفحه اصلی</NavLink>
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
            <li>
              <NavLink className='bg-slate-200 text-blue-500 p-2 px-10 rounded-md'>صفحه اصلی</NavLink>
            </li>
          </ul>
        </div>
        <ul className='hidden justify-center items-center gap-10 lg:flex'>
          <li>
            <NavLink className='header__navlink-active text-white text-xl'>صفحه اصلی</NavLink>
          </li>
          <li>
            <NavLink className='header__navlink text-white text-xl'>ثبت سفارش</NavLink>
          </li>
          <li>
            <NavLink className='header__navlink text-white text-xl'>ارتباط با ما</NavLink>
          </li>
          <li>
            <NavLink className='header__navlink text-white text-xl'>درباره ما</NavLink>
          </li>
          <li>
            <NavLink className='header__navlink text-white text-xl'>ثبت شکایات</NavLink>
          </li>
        </ul>
        <Btn
          bgColor='bg-blue-500'
          color='text-white'
          border='border border-white'
          hoverBgColor='hover:bg-white'
          hoverColor='hover:text-blue-500'
          hoverBorder='hover:border-blue-500'
          text='ثبت نام / ورود'
        />
      </div>
    </>
  )
}