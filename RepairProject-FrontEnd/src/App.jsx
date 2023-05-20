import { useRoutes } from "react-router-dom"
import { routes } from "./routes"
import { Header } from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import { useEffect } from "react"
import { get } from "./utility"

function App() {
  const router = useRoutes(routes)

  // useEffect(() => {
  //   get(`/informations/get?token=${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZmlyc3ROYW1lIjoi2KfZhduM2LEiLCJsYXN0TmFtZSI6Itit2LPbjNmG24wiLCJyb2xlIjoidXNlciIsImNpdHkiOiLZhtuM2LTYp9io2YjYsSIsInBob25lIjoiMDkxNTE1MTU2MjMiLCJwcm9maWxlIjpudWxsLCJjcmVhdGVkQXQiOiIyMDIzLTA1LTIwVDExOjQ5OjA5LjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA1LTIwVDExOjQ5OjA5LjAwMFoiLCJpYXQiOjE2ODQ1ODMzODUsImV4cCI6MTY4NzE3NTM4NX0.i6nMzSg-2dm72N-H6p1Sk1FtDp0Gvceh4Zd-al4S6v4'
  //     }`).then(res => console.log(res))
  // }, [])

  return (
    <>
      {
        location.pathname !== '/register' &&
        <Header />
      }
      {router}
      {
        location.pathname !== '/register' &&
        <Footer />
      }
    </>
  )
}

export default App