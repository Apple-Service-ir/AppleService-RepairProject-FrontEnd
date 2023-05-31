import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx"
import Home from "./pages/Home/Home.jsx"
import Order from "./pages/Order/Order.jsx"
import Register from "./pages/Register/Register.jsx"
import UserDashboard from "./pages/Dashboards/UserDashboard.jsx"
import UserOrders from "./pages/Dashboards/UserOrders.jsx"
import UserTickets from "./pages/Dashboards/UserTickets.jsx"
import AdminDashboard from "./pages/Dashboards/AdminDashboard.jsx"
import AdminHome from "./pages/Dashboards/AdminHome.jsx"
import AdminUsers from "./pages/Dashboards/AdminUsers.jsx"

const routes = [
  { path: '/', element: <Home /> },
  {
    path: '/order',
    element: <PrivateRoute reDirectPath='/register' privateRole={''}> <Order /> </PrivateRoute>
  },
  { path: '/register', element: <Register /> },
  {
    path: '/dashboard',
    element: <PrivateRoute reDirectPath='/register' privateRole={''}> <UserDashboard /> </PrivateRoute>,
    children: [
      { path: '/dashboard/orders', element: <UserOrders /> },
      { path: '/dashboard/tickets', element: <UserTickets /> }
    ]
  },
  {
    path: '/admin',
    element: <PrivateRoute reDirectPath={'/'} privateRole={'user'}> <AdminDashboard /> </PrivateRoute>,
    children: [
      { path: '/admin', element: <AdminHome /> },
      { path: '/admin/users', element: <AdminUsers /> },
    ]
  }
]

export { routes }