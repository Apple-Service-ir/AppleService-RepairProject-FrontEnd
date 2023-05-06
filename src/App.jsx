import { useRoutes } from "react-router-dom"
import { routes } from "./routes"
import Footer from "./components/Footer/Footer"

function App() {
  const router = useRoutes(routes)
  return (
    <>
      {router}
      <Footer />
    </>
  )
}

export default App