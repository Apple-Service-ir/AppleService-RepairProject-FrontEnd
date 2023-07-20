import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import AuthContext from '../../context/AuthContext'
import LoadingContext from '../../context/LoadingContext'
import { useState } from 'react'

export function Header() {
  const authcontext = useContext(AuthContext)
  const loadingContext = useContext(LoadingContext)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  function closeMobileMenu() {
    setShowMobileMenu(false)
  }

  window.addEventListener('click', event => {
    event.target.dataset.close === 'mobile-menu' && setShowMobileMenu(false)
  })

  return (
    <>
      <div className='bg-blue-500 w-screen flex justify-between items-center p-3 px-7 z-50'>
        <div
          className="btn btn-ghost text-xl flex items-center relative lg:hidden"
          onClick={() => {
            showMobileMenu ? setShowMobileMenu(false) : setShowMobileMenu(true)
          }}
        >
          {
            showMobileMenu ? (
              <svg
                className="stroke-white w-9 h-9 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="stroke-white w-9 h-9 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              </svg>
            )
          }
        </div>
        <ul className='hidden justify-center items-center gap-9 lg:flex'>
          <li>
            <NavLink
              className={link => link.isActive ? 'header__navlink-active' : 'header__navlink'}
              to='/'
            >
              صفحه اصلی
            </NavLink>
          </li>
          <li>
            <NavLink
              className={link => link.isActive ? 'header__navlink-active' : 'header__navlink'}
              to='/order'
              onClick={() => {
                loadingContext.setProgressIsLoadingHandler(true)
              }}
            >
              ثبت سفارش
            </NavLink>
          </li>
          <li>
            <NavLink
              className={link => link.isActive ? 'header__navlink-active' : 'header__navlink'}
              to='/contact-us'
            >
              ارتباط با ما
            </NavLink>
          </li>
          <li>
            <NavLink
              className={link => link.isActive ? 'header__navlink-active' : 'header__navlink'}
              to='/report'
            >
              ثبت شکایات
            </NavLink>
          </li>
        </ul>
        {
          authcontext.isLogin ? (
            <NavLink
              className={link => link.isActive ? 'btn btn-white' : 'btn btn-out-white'}
              to='/dashboard'
              onClick={() => {
                loadingContext.setProgressIsLoadingHandler(true)
              }}
            >
              {authcontext.userInfo.firstName} {authcontext.userInfo.lastName}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-5 h-5">
                <path className="duration-0" strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </NavLink>
          ) : (
            <NavLink
              className='btn btn-out-white'
              to='/register'
              onClick={() => {
                loadingContext.setProgressIsLoadingHandler(true)
              }}
            >
              ثبت نام / ورورد
            </NavLink>
          )
        }
      </div>

      <div
        className={`w-screen h-screen fixed top-0 left-0 z-50
          ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}
          lg:hidden
        `}
        data-close={'mobile-menu'}
      >
        <div
          className={`bg-white h-full w-4/6 flex flex-col items-center
          shadow-2xl absolute top-0 left-0`}
        >
          <ul className='w-full flex flex-col justify-center items-center gap-3 p-3'>
            <li className='w-full'>
              <NavLink
                className={link => link.isActive ? 'btn btn-blue w-full' : 'btn btn-out-blue w-full'}
                to='/'
                onClick={() => {
                  closeMobileMenu()
                }}
              >
                صفحه اصلی
              </NavLink>
            </li>
            <li className='w-full'>
              <NavLink
                className={link => link.isActive ? 'btn btn-blue w-full' : 'btn btn-out-blue w-full'}
                to='/order'
                onClick={() => {
                  closeMobileMenu()
                  loadingContext.setProgressIsLoadingHandler(true)
                }}
              >
                ثبت سفارش
              </NavLink>
            </li>
            <li className='w-full'>
              <NavLink
                className={link => link.isActive ? 'btn btn-blue w-full' : 'btn btn-out-blue w-full'}
                to='/contact-us'
                onClick={() => {
                  closeMobileMenu()
                  loadingContext.setProgressIsLoadingHandler(true)
                }}
              >
                ارتباط با ما
              </NavLink>
            </li>
            <li className='w-full'>
              <NavLink
                className={link => link.isActive ? 'btn btn-blue w-full' : 'btn btn-out-blue w-full'}
                to='/report'
                onClick={() => {
                  closeMobileMenu()
                  loadingContext.setProgressIsLoadingHandler(true)
                }}
              >
                ثبت شکایات
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}