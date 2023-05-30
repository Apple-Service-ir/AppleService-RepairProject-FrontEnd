import React from 'react'
import { NavLink } from 'react-router-dom'

function SideBarLink({ link, title, svg }) {
  return (
    <NavLink
      to={link}
      className={link => link.isActive ? 'sidebar-link-active' : 'sidebar-link'}
    >
      {title}
      {svg}
      <div className='sidebar-circle-t'></div>
      <span className='sidebar-circle-b'></span>
    </NavLink>
  )
}

export default SideBarLink