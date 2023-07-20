import React, { useEffect, useContext } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import LoadingContext from './../../context/LoadingContext'

function RepairMan() {
  const loadingContext = useContext(LoadingContext)

  useEffect(() => {
    loadingContext.setProgressIsLoadingHandler(false)
  }, [])

  return (
    <>
      <div className='w-full flex flex-col justify-center items-center gap-6
        show-fade'>
        <div className="w-full flex justify-center items-center">
          <NavLink
            className={link => link.isActive ? 'btn btn-blue rounded-l-none' : 'btn btn-out-blue rounded-l-none border-l-0'}
            to={'get'}
            onClick={() => {
              loadingContext.setProgressIsLoadingHandler(true)
            }}
          >
            گرفتن سفارش
          </NavLink>
          <NavLink
            className={link => (link.isActive && location.pathname.endsWith('/repairman')) ? 'btn btn-blue rounded-none border-r-0' : 'btn btn-out-blue rounded-none'}
            to={''}
            onClick={() => {
              loadingContext.setProgressIsLoadingHandler(true)
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 duration-0">
              <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </NavLink>
          <NavLink
            className={link => link.isActive ? 'btn btn-blue rounded-r-none border-r-0' : 'btn btn-out-blue rounded-r-none border-r-0'}
            to={'done'}
            onClick={() => {
              loadingContext.setProgressIsLoadingHandler(true)
            }}
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