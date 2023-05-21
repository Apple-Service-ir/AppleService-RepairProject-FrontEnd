import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { getMe } from '../../utility'

function PrivateRoute({ reDirectPath, children }) {
  const [isLogin, setIsLogin] = useState(true)

  useEffect(() => {
    getMe().then(response => {
      response === null && setIsLogin(false)
    })
  }, [])

  return isLogin ? children : <Navigate to={reDirectPath} />
}

export default PrivateRoute