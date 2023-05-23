import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'

import AuthContext from '../../context/AuthContext'

function PrivateRoute({ reDirectPath, children }) {
  const authContext = useContext(AuthContext)

  return authContext.isLogin ? children : <Navigate to={reDirectPath} />
}

export default PrivateRoute