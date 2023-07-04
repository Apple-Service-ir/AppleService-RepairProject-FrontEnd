import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

function RepairMan() {
  return (
    <>
      <div className='w-full flex flex-col justify-center items-center gap-6
        show-fade'>
        <div className="w-full flex justify-center items-center">
          <NavLink
            to={'get'}
            className={link => link.isActive ? 'btn btn-blue rounded-l-none' : 'btn btn-out-blue rounded-l-none border-l-0'}
          >
            گرفتن سفارش
          </NavLink>
          <NavLink
            to={''}
            className={link => (link.isActive && location.pathname.endsWith('/repairman')) ? 'btn btn-blue rounded-none border-r-0' : 'btn btn-out-blue rounded-none'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 duration-0">
              <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </NavLink>
          <NavLink
            to={'done'}
            className={link => link.isActive ? 'btn btn-blue rounded-r-none border-r-0' : 'btn btn-out-blue rounded-r-none border-r-0'}
          >
            انجام شده
          </NavLink>
        </div>
        <Outlet />
      </div>
    </>
  )
}

export default RepairMan