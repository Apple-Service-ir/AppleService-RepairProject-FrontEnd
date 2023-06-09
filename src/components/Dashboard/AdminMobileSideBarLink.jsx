import React from 'react'
import { NavLink } from 'react-router-dom'

function AdminSideBarMobile({ link, title, svg }) {
  return (
    <NavLink
      to={link}
      className={path =>
        (path.isActive && location.pathname.endsWith(link))
          ? 'btn btn-white w-full'
          : 'btn btn-out-white w-full'
      }
    >
      {title}
      {svg}
    </NavLink>
  )
}

export default AdminSideBarMobile