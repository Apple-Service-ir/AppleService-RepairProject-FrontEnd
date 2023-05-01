import React from 'react'
import { NavLink } from 'react-router-dom'
import "./Header.css"

export function Header() {
  return (
    <div className='container h-20 flex justify-between items-center px-5 mt-5 rounded-md'>
      <div className="btn btn-ghost text-xl flex items-center md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-white w-9 h-9 cursor-pointer">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
        </svg>
      </div>
      <ul className='hidden justify-center items-center gap-10 md:flex'>
        <li>
          <NavLink className='header__navlink-active text-white text-xl'>صفحه اصلی</NavLink>
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
        <li>
          <NavLink className='header__navlink text-white text-xl'>همکاری با ما</NavLink>
        </li>
      </ul>
      <NavLink className='btn btn-outline text-white border-white text-xl hover:bg-white hover:text-blue-500'>ثبت نام / ورود</NavLink>
    </div>
  )
}