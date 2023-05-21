import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getMe } from '../../utility'

function PrivateRoute({ reDirectPath, children }) {
  const [isLogin, setIsLogin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getMe().then(response => {
      response && setIsLogin(response)
    })
  }, [])

  return isLogin ? children : navigate(reDirectPath)

}

export default PrivateRoute