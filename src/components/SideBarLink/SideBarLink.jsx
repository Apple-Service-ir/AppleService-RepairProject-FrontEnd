import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

function SideBarLink({ link, title, svg, rank }) {
  const authContext = useContext(AuthContext)

  if (rank.includes(authContext.userInfo.role)) {
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
}

export default SideBarLink