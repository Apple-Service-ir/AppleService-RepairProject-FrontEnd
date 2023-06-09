import React from 'react'
import { NavLink } from 'react-router-dom'

function AdminSideBarLink({ link, title, svg }) {
  return (
    <NavLink
      to={link}
      className={path =>
        (path.isActive && location.pathname.endsWith(link))
          ? 'sidebar-link-active'
          : 'sidebar-link'
      }
    >
      {title}
      {svg}
      <div className='sidebar-circle-t'></div>
      <span className='sidebar-circle-b'></span>
    </NavLink>
  )
}

export default AdminSideBarLink