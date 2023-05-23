import React from 'react'
import { Outlet } from 'react-router-dom'

import { routes } from './../../routes'
import UserDashboradSideBar from '../../components/Dashboards/UserDashboradSideBar.jsx'

function UserDashboard() {
  return (
    <div className='w-screen flex'>
      <div className="w-3/12 p-6">
        <UserDashboradSideBar />
      </div>
      <div className="w-9/12 rounded-xl p-6">{<Outlet />}</div>
    </div>
  )
}

export default UserDashboard