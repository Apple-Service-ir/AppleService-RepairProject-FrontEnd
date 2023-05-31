import React, { useState, useEffect, useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'

import AuthContext from '../../context/AuthContext'
import { getMe } from '../../utility'

function UserDashboradSideBar() {
  const authContext = useContext(AuthContext)
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    getMe().then(response => {
      response && setUserInfo(response)
    })
  }, [])

  return (
    <div className='bg-blue-500 w-full min-h-max flex flex-col items-center rounded-xl p-3'>
      <svg className='w-24 h-24' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.4" d="M18 18.86H17.24C16.44 18.86 15.68 19.17 15.12 19.73L13.41 21.42C12.63 22.19 11.36 22.19 10.58 21.42L8.87 19.73C8.31 19.17 7.54 18.86 6.75 18.86H6C4.34 18.86 3 17.53 3 15.89V4.97998C3 3.33998 4.34 2.01001 6 2.01001H18C19.66 2.01001 21 3.33998 21 4.97998V15.89C21 17.52 19.66 18.86 18 18.86Z" fill="white" />
        <path d="M11.9999 10.41C13.2868 10.41 14.33 9.36684 14.33 8.08002C14.33 6.79319 13.2868 5.75 11.9999 5.75C10.7131 5.75 9.66992 6.79319 9.66992 8.08002C9.66992 9.36684 10.7131 10.41 11.9999 10.41Z" fill="white" />
        <path d="M14.6792 15.0601C15.4892 15.0601 15.9592 14.1601 15.5092 13.4901C14.8292 12.4801 13.5092 11.8 11.9992 11.8C10.4892 11.8 9.16918 12.4801 8.48918 13.4901C8.03918 14.1601 8.5092 15.0601 9.3192 15.0601H14.6792Z" fill="white" />
      </svg>
      <span className='text-white border-blue-400 border-b w-full text-center text-xl sansbold
        tracking-wide flex justify-center items-center gap-3 py-1'>
        <Link>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-white w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </Link>
        {userInfo.firstName} {userInfo.lastName}
      </span>
      <div className="w-full flex flex-col justify-center items-center gap-3 mt-3">
        <NavLink
          to='orders'
          className={link => link.isActive ? 'btn btn-white w-full' : 'btn btn-out-white w-full'}
        >
          سفارشات
        </NavLink>
        <NavLink
          to='tickets'
          className={link => link.isActive ? 'btn btn-white w-full' : 'btn btn-out-white w-full'}
        >
          تیکت پشتیبانی
        </NavLink>
      </div>
      <Link className='btn btn-danger w-full mt-9'
        onClick={authContext.logOut}>خروج از حساب</Link>
    </div>
  )
}

export default UserDashboradSideBar