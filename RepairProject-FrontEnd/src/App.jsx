import { useRoutes } from "react-router-dom"
import { routes } from "./routes"
import { Header } from "./components/Header/Header"
import Footer from "./components/Footer/Footer"

function App() {
  const router = useRoutes(routes)

  return (
    <>
      {
        (
          location.pathname !== '/register'
          && location.pathname !== '/dashboard'
        ) && <Header />
      }
      {router}
      {
        (
          location.pathname !== '/register'
          && location.pathname !== '/dashboard'
        ) && <Footer />
      }
    </>
  )
}

export default App