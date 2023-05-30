import React, { useEffect, useState } from "react"
import { useRoutes, useNavigate } from "react-router-dom"
import { routes } from "./routes"
import { Header } from "./components/Header/Header"
import Footer from "./components/Footer/Footer"

import AuthContext from "./context/AuthContext"
import { get, post } from "./utility"
import { toast } from "react-hot-toast"

function App() {
  const [userToken, setUserToken] = useState(null)
  const [isLogin, setIslogin] = useState(localStorage.getItem("e-service-token") ? true : false)
  const [userInfo, setUserInfo] = useState({})

  const router = useRoutes(routes)
  const redirect = useNavigate()

  const login = (token, info) => {
    setUserToken(token)
    setIslogin(true)
    setUserInfo(info)
    localStorage.setItem('e-service-token', token)
  }

  const logOut = () => {
    post('/logout', { token: userToken })
      .then(response => {
        if (response.data.ok) {
          setUserToken(null)
          setIslogin(false)
          setUserInfo({})
          localStorage.removeItem('e-service-token')
          redirect('/')
        } else toast.error(response.data.err)
      })
  }

  useEffect(() => {
    const localStorageData = localStorage.getItem('e-service-token')
    get(`/informations/get?token=${localStorageData}`)
      .then(response => {
        if (response.data.ok) {
          setIslogin(true)
          setUserInfo(response.data.user)
          setUserToken(localStorageData)
        }
        else {
          setUserToken(null)
          setIslogin(false)
          setUserInfo({})
          localStorage.removeItem('e-service-token')
        }
      })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        userToken,
        isLogin,
        userInfo,
        login,
        logOut
      }}
    >
      {
        (
          location.pathname !== '/register'
          && location.pathname !== '/admin'
        ) && <Header />
      }
      {router}
      {
        (
          location.pathname !== '/register'
          && location.pathname !== '/dashboard'
          && location.pathname !== '/dashboard/orders'
          && location.pathname !== '/dashboard/tickets'
          && location.pathname !== '/admin'
        ) && <Footer />
      }
    </AuthContext.Provider>
  )
}

export default App