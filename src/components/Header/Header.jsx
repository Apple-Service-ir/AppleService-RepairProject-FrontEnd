import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <div className='container h-20 flex justify-between items-center px-5 mt-5 rounded-md'>
      <ul className='flex justify-center items-center gap-10'>
        <li>
          <NavLink className='text-white text-xl'>ارتباط با ما</NavLink>
        </li>
        <li>
          <NavLink className='text-white text-xl'>درباره ما</NavLink>
        </li>
        <li>
          <NavLink className='text-white text-xl'>همکاری با ما</NavLink>
        </li>
        <li>
          <NavLink className='text-white text-xl'>ثبت شکایات</NavLink>
        </li>
      </ul>
      <NavLink className='text-white border border-white text-xl px-7 py-3 rounded-full
        hover:bg-white hover:text-blue-500'>ثبت نام / ورود</NavLink>
    </div>
  )
}
