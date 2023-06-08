import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'

import AuthContext from '../../context/AuthContext'

function PrivateRoute({ reDirectPath, children, privateRole }) {
  const authContext = useContext(AuthContext)

  switch (privateRole) {
    case 'isUserLoggedIn': {
      return authContext.isLogin ? children : <Navigate to={reDirectPath} />
    }

    case 'isUserNotLoggedIn': {
      return authContext.isLogin ? <Navigate to={reDirectPath} /> : children
    }

    case 'isSupporter': {
      return ['admin', 'supporter'].includes(authContext.userInfo.role) ? children : <Navigate to={reDirectPath} />
    }

    case 'isAdmin': {
      return authContext.userInfo.role === 'admin' ? children : <Navigate to={reDirectPath} />
    }

    default: {
      return children
    }
  }
}

export default PrivateRoute