import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useRoutes, useNavigate } from "react-router-dom"
import { routes } from "./routes"
import { Header } from "./components/Header/Header"
import Footer from "./components/Footer/Footer"

import { get, post } from "./utility"
import { toast } from "react-hot-toast"
import AuthContext from "./context/AuthContext"
import Loader from "./components/Loader/Loader"

const containingHeader = [
  '/',
  '/order',
  '/dashboard',
  '/dashboard/orders',
  '/dashboard/tickets',
]

const containingFooter = [
  '/',
  '/order',
]

function App() {
  const [userToken, setUserToken] = useState(null)
  const [isLogin, setIslogin] = useState(localStorage.getItem("e-service-token") ? true : false)
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem("e-service-userInfo") ? JSON.parse(localStorage.getItem("e-service-userInfo")) : {}
  )
  const [screenLoaing, setScreenLoading] = useState(true)

  const router = useRoutes(routes)
  const redirect = useNavigate()

  const login = (token, info) => {
    setUserToken(token)
    setIslogin(true)
    setUserInfo(info)
    localStorage.setItem('e-service-token', token)
    localStorage.setItem('e-service-userInfo', JSON.stringify(info))
  }

  const logOut = () => {
    post('/logout', { token: userToken })
      .then(() => {
        setUserToken(null)
        setIslogin(false)
        setUserInfo({})
        localStorage.removeItem('e-service-token')
        localStorage.removeItem('e-service-userInfo')
        redirect('/')
      }).catch((err) => {
        toast.error(err.response.data.err)
      })
  }

  const setUserInfoHandler = userInfo => setUserInfo(userInfo)

  useEffect(() => {
    const localStorageToken = localStorage.getItem('e-service-token')
    get(`/informations/get?token=${localStorageToken}`)
      .then(response => {
        setIslogin(true)
        setUserInfo(response.data.user)
        setUserToken(response.data.token)
        localStorage.setItem('e-service-userInfo', JSON.stringify(response.data.user))
      }).catch(() => {
        setUserToken(null)
        setIslogin(false)
        setUserInfo({})
        localStorage.removeItem('e-service-token')
        localStorage.removeItem('e-service-userInfo')
      })
      .finally(() => {
        setScreenLoading(false)
      })
  }, [])

  return (
    <>
      <AuthContext.Provider
        value={{
          userToken,
          isLogin,
          userInfo,
          setUserInfoHandler,
          login,
          logOut
        }}
      >
        {
          containingHeader.includes(location.pathname) && <Header />
        }

        {router}

        {
          containingFooter.includes(location.pathname) && <Footer />
        }
      </AuthContext.Provider>
      {
        screenLoaing && createPortal(
          <div className="bg-black bg-opacity-25 backdrop-blur-xl
          w-screen h-screen flex justify-center items-center p-3 overflow-hidden
          fixed top-0 left-0 z-50">
            <Loader size={'w-16 h-16'} before={'before:bg-white'} />
          </div>,
          document.body
        )
      }
    </>
  )
}

export default App