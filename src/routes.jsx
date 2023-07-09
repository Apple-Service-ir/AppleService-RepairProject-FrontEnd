import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx"
import Home from "./pages/Home/Home.jsx"
import Order from "./pages/Order/Order.jsx"
import Register from "./pages/Register/Register.jsx"

import UserDashboard from "./pages/Dashboards/UserDashboard.jsx"
import UserHome from "./pages/Dashboards/UserHome.jsx"
import UserOrders from "./pages/Dashboards/UserOrders.jsx"
import UserTickets from "./pages/Dashboards/UserTickets.jsx"

import RepairMan from "./pages/Dashboards/RepairMan.jsx"
import RepairManHome from "./pages/Dashboards/RepairManHome.jsx"
import RepairManGetOrder from "./pages/Dashboards/RepairManGetOrder.jsx"
import RepairManDoneOrders from "./pages/Dashboards/RepairManDoneOrders.jsx"

import AdminDashboard from "./pages/Dashboards/AdminDashboard.jsx"
import AdminHome from "./pages/Dashboards/AdminHome.jsx"
import AdminUsers from "./pages/Dashboards/AdminUsers.jsx"
import AdminOrders from "./pages/Dashboards/AdminOrders.jsx"
import AdminTickets from "./pages/Dashboards/AdminTickets.jsx"
import AdminDevices from "./pages/Dashboards/AdminDevices.jsx"
import AdminParts from "./pages/Dashboards/AdminParts.jsx"
import AdminCities from "./pages/Dashboards/AdminCities.jsx"

import TransActionResponse from "./pages/TransActionResponse/TransActionResponse.jsx"

const routes = [
  { path: '/', element: <Home /> },
  {
    path: '/order',
    element: <PrivateRoute reDirectPath='/register' privateRole={'isUserLoggedIn'}> <Order /> </PrivateRoute>
  },
  {
    path: '/register',
    element: <PrivateRoute reDirectPath='/' privateRole={'isUserNotLoggedIn'}> <Register /> </PrivateRoute>
  },
  {
    path: '/dashboard',
    element: <PrivateRoute reDirectPath='/register' privateRole={'isUserLoggedIn'}> <UserDashboard /> </PrivateRoute>,
    children: [
      { path: '/dashboard', element: <UserHome /> },
      { path: '/dashboard/orders', element: <UserOrders /> },
      { path: '/dashboard/tickets', element: <UserTickets /> },
      {
        path: '/dashboard/repairman',
        element: <RepairMan />,
        children: [
          {
            path: '/dashboard/repairman', element: <PrivateRoute reDirectPath='/dashboard' privateRole={'isRepairMan'}>

            </PrivateRoute>
          },
          { path: '/dashboard/repairman/get', element: <RepairManGetOrder /> },
          { path: '/dashboard/repairman/done', element: <RepairManDoneOrders /> }
        ]
      }
    ]
  },
  {
    path: '/admin',
    element:
      <PrivateRoute
        reDirectPath={'/'}
        privateRole={'isSupporter'}
      >
        <AdminDashboard />
      </PrivateRoute>,
    children: [
      { path: '/admin', element: <AdminHome /> },
      {
        path: '/admin/users',
        element: <AdminUsers />
      },
      { path: '/admin/orders', element: <AdminOrders /> },
      { path: '/admin/tickets', element: <AdminTickets /> },
      { path: '/admin/devices', element: <PrivateRoute reDirectPath={'/admin'} privateRole={'isAdmin'}> <AdminDevices /> </PrivateRoute> },
      { path: '/admin/parts', element: <PrivateRoute reDirectPath={'/admin'} privateRole={'isAdmin'}> <AdminParts /> </PrivateRoute> },
      { path: '/admin/cities', element: <PrivateRoute reDirectPath={'/admin'} privateRole={'isAdmin'}> <AdminCities /> </PrivateRoute> },
    ]
  },
  { path: '/transaction', element: <TransActionResponse /> },
]

export { routes }