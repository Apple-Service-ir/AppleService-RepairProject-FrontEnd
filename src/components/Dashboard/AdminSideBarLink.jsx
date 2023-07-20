import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import LoadingContext from '../../context/LoadingContext'

function AdminSideBarLink({ link, title, svg }) {
  const loadingContext = useContext(LoadingContext)

  return (
    <NavLink
      className={path =>
        (path.isActive && location.pathname.endsWith(link))
          ? 'sidebar-link-active'
          : 'sidebar-link'
      }
      to={link}
      onClick={() => {
        loadingContext.setProgressIsLoadingHandler(true)
      }}
    >
      {title}
      {svg}
      <div className='sidebar-circle-t'></div>
      <span className='sidebar-circle-b'></span>
    </NavLink>
  )
}

export default AdminSideBarLink