import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'

import AuthContext from '../../context/AuthContext'

function PrivateRoute({ reDirectPath, children, privateRole }) {
  const authContext = useContext(AuthContext)

  return (authContext.isLogin && authContext.userInfo.role !== privateRole)
    ? children
    : <Navigate to={reDirectPath} />
}

export default PrivateRoute