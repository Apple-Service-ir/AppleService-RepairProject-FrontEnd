import React from 'react'
import { Outlet } from 'react-router-dom'

import { routes } from './../../routes'
import UserDashboradSideBar from '../../components/Dashboards/UserDashboradSideBar.jsx'

function UserDashboard() {
  return (
    <div className='w-screen flex flex-col
      lg:flex-row'>
      <div className="w-full p-6
        lg:w-3/12 lg:pl-3">
        <UserDashboradSideBar />
      </div>
      <div className="w-full rounded-xl p-6 relative
        lg:w-9/12 lg:pr-3">{<Outlet />}</div>
    </div>
  )
}

export default UserDashboard