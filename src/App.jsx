import React, { useEffect, useState } from "react"
import { useRoutes } from "react-router-dom"
import { routes } from "./routes"
import { Header } from "./components/Header/Header"
import Footer from "./components/Footer/Footer"

import AuthContext from "./context/AuthContext"
import { get } from "./utility"

function App() {
  const [userToken, setUserToken] = useState(null)
  const [isLogin, setIslogin] = useState(localStorage.getItem("e-service-token") ? true : false)
  const [userInfo, setUserInfo] = useState({})

  const router = useRoutes(routes)

  const login = (token, info) => {
    console.log('login');
    setUserToken(token)
    setIslogin(true)
    setUserInfo(info)
    localStorage.setItem('e-service-token', token)
  }

  const logOut = () => {
    setUserToken(null)
    setIslogin(false)
    setUserInfo({})
    localStorage.removeItem('e-service-token')
  }

  useEffect(() => {
    const localStorageData = localStorage.getItem('e-service-token')
    get(`/informations/get?token=${localStorageData}`)
      .then(response => {
        console.log(response);
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
        ) && <Header />
      }
      {router}
      {
        (
          location.pathname !== '/register'
          && location.pathname !== '/dashboard'
        ) && <Footer />
      }
    </AuthContext.Provider>
  )
}

export default App