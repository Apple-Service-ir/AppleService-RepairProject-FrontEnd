import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useRoutes, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

import { routes } from "./routes"
import { get, post } from "./utility"
import AuthContext from "./context/AuthContext"
import LoadingContext from "./context/LoadingContext"
import Loader from "./components/Loader/Loader"
import { Header } from "./components/Header/Header"
import Footer from "./components/Footer/Footer"

const containingHeader = [
  '/',
  '/order',
  '/dashboard',
  '/dashboard/orders',
  '/dashboard/tickets',
  '/dashboard/repairman',
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
  const [progressIsLoading, setProgressIsLoading] = useState(false)

  const router = useRoutes(routes)
  const redirect = useNavigate()

  const progressIsLoadingRef = useRef()

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

  const setProgressIsLoadingHandler = (status) => {
    if (status) {
      setProgressIsLoading(true)
    }
    else {
      progressIsLoadingRef.current.classList.remove('page-progress-loading');
      setTimeout(() => {
        setProgressIsLoading(false)
      }, 100);
    }
  }

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
        <LoadingContext.Provider
          value={{
            progressIsLoading,
            setProgressIsLoadingHandler
          }}
        >
          {
            containingHeader.includes(location.pathname) && <Header />
          }

          {router}

          {
            containingFooter.includes(location.pathname) && <Footer />
          }
        </LoadingContext.Provider>
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

      {
        progressIsLoading && createPortal(
          <div
            className='bg-white w-full h-0.5 fixed top-0 left-0 z-50 page-progress-loading
              before:bg-blue-500 before:content-[""] before:w-full before:h-0.5 before:absolute
              before:top-full before:left-0'
            ref={progressIsLoadingRef}
          >
          </div>,
          document.body
        )
      }
    </>
  )
}

export default App