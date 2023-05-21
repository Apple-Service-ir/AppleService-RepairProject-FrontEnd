import React, { useState, useEffect } from 'react'

import { getMe } from "./../../utility.js"
import UserDashboradSideBar from '../../components/Dashboards/UserDashboradSideBar.jsx'

function UserDashboard() {
  return (
    <div className='w-screen h-screen flex'>
      <div className="w-3/12 h-3/4 p-6">
        <UserDashboradSideBar />
      </div>
      <div className="w-9/12 h-screen rounded-xl"></div>
    </div>
  )
}

export default UserDashboard