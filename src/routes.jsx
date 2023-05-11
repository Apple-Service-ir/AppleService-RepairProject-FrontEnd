import Home from "./pages/Home/Home.jsx"
import Order from "./pages/Order/Order.jsx"
import Register from "./pages/Register/Register.jsx"

const routes = [
  { path: '/', element: <Home /> },
  { path: '/order', element: <Order /> },
  { path: '/register', element: <Register /> },
]

export {routes}