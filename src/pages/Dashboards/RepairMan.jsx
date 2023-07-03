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
            className={link => link.isActive ? 'btn btn-blue rounded-l-none' : 'btn btn-out-blue rounded-l-none'}
          >
            گرفتن سفارش
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