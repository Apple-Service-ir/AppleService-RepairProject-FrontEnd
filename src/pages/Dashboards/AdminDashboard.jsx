import React, { useContext, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { toast, Toaster } from 'react-hot-toast'

import AuthContext from '../../context/AuthContext'
import useGetCities from './../../Hooks/useGetCities'
import AdminSideBarLink from '../../components/Dashboard/AdminSideBarLink'
import AdminSideBarMobile from '../../components/Dashboard/AdminMobileSideBarLink'
import PortalModal from './../../components/PortalModal/PortalModal'

function AdminDashboard() {
  const authContext = useContext(AuthContext)

  const [defaultCity, allCities] = useGetCities()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showEditInformationModal, setShowEditInformationModal] = useState(false)
  const [editInformationForm, setEditInformationForm] = useState({
    firstName: { value: '', validation: false },
    lastName: { value: '', validation: false },
    city: { value: '', validation: true },
  })

  document.body.addEventListener('click', event => {
    if (event.target.dataset.mobilebtn !== 'true') {
      setShowMobileMenu(false)
    }
  })

  const changeUserInformationHandler = event => {
    event.preventDefault()

    for (const field in editInformationForm) {
      if (!editInformationForm[field].validation) {
        return toast.error('لطفا فیلد هارا کامل کنید')
      }
    }

    const requestBody = {
      token: authContext.userToken,
      firstName: editInformationForm.firstName.value,
      lastName: editInformationForm.lastName.value,
      city: editInformationForm.city.value || defaultCity.id
    }
  }

  return (
    <>
      <div className='w-screen h-screen flex overflow-hidden'>
        <div className="bg-blue-500 w-4/12 h-full hidden flex-col items-center gap-3
        sm:flex lg:w-2/12">
          <div className="flex flex-col justify-center items-center gap-3 p-3">
            <div className="bg-blue-400 w-28 h-28 rounded-full"></div>
            <span className='text-white flex justify-center items-center gap-1'>
              <div
                className='w-5 h-5 group cursor-pointer'
                onClick={() => setShowEditInformationModal(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 group-hover:-translate-y-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              {authContext.userInfo.firstName} {authContext.userInfo.lastName}
            </span>
          </div>
          <ul className='w-full flex flex-col justify-center items-center gap-3 pr-3'>
            <AdminSideBarLink
              link={'/admin'}
              title={'داشبورد'}
              svg={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                  <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              )}
            />
            {
              authContext.userInfo.role === 'admin' && (
                <AdminSideBarLink
                  link={'users'}
                  title={'کاربران'}
                  svg={(
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                      <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  )}
                />
              )
            }
            <AdminSideBarLink
              link={'orders'}
              title={'سفارشات'}
              svg={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                  <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              )}
            />
            <AdminSideBarLink
              link={'tickets'}
              title={'تیکت ها'}
              svg={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                  <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
              )}
            />
            <AdminSideBarLink
              link={'devices'}
              title={'دستگاه ها'}
              svg={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              )}
            />
            <AdminSideBarLink
              link={'parts'}
              title={'قطعات'}
              svg={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                </svg>
              )}
            />
            <AdminSideBarLink
              link={'/dashboard'}
              title={'خروج از پنل'}
              svg={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                  <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              )}
            />
          </ul>
        </div>

        <div className="w-full h-full p-6 overflow-y-scroll
        sm:w-8/12 lg:w-10/12">
          <div className="w-full flex justify-between items-center mb-9 relative
          sm:hidden">
            {
              showMobileMenu && (
                <ul className='bg-blue-500 shadow-xl shadow-[#00000035] w-72
                flex flex-col justify-center items-center gap-3
                p-6 rounded-xl absolute right-0 top-16 z-50 show-up'>
                  <span className='text-white flex justify-center items-center gap-1 my-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-7 h-7 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {authContext.userInfo.firstName} {authContext.userInfo.lastName}
                  </span>
                  <AdminSideBarMobile
                    link={'/admin'}
                    title={'داشبورد'}
                    svg={(
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                        <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    )}
                  />
                  {
                    authContext.userInfo.role === 'admin' && (
                      <AdminSideBarMobile
                        link={'users'}
                        title={'کاربران'}
                        svg={(
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                            <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                          </svg>
                        )}
                      />
                    )
                  }
                  <AdminSideBarMobile
                    link={'orders'}
                    title={'سفارشات'}
                    svg={(
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                        <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                    )}
                  />
                  <AdminSideBarMobile
                    link={'tickets'}
                    title={'تیکت ها'}
                    svg={(
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                        <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                      </svg>
                    )}
                  />
                  <AdminSideBarMobile
                    link={'devices'}
                    title={'دستگاه ها'}
                    svg={(
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                        <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                      </svg>
                    )}
                  />
                  <AdminSideBarMobile
                    link={'parts'}
                    title={'قطعات'}
                    svg={(
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                        <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                      </svg>
                    )}
                  />
                </ul>
              )
            }
            <button
              className='btn btn-out-blue relative'
              data-mobilebtn={'true'}
              onClick={() => {
                showMobileMenu ? setShowMobileMenu(false) : setShowMobileMenu(true)
              }}
            >
              {
                showMobileMenu ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                    stroke="currentColor"
                    className="duration-0 w-6 h-6"
                    data-mobilebtn={'true'}
                  >
                    <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                    stroke="currentColor"
                    className="duration-0 w-6 h-6"
                    data-mobilebtn={'true'}
                  >
                    <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                  </svg>
                )
              }
            </button>
            <Link to={'/dashboard'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="stroke-blue-500 w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </Link>
          </div>

          <Outlet />
        </div>
      </div>

      {
        showEditInformationModal && (
          <PortalModal
            closeHandler={() => setShowEditInformationModal(false)}
          >
            <form className='bg-white w-96 flex flex-col justify-center items-center gap-3 p-3 rounded-xl'>
              <div className='w-full bg-input'>
                <input
                  className='input'
                  type="text"
                  placeholder='نام جدید'
                  value={editInformationForm.firstName.value}
                  onChange={event => {
                    setEditInformationForm(prev => ({
                      ...prev,
                      firstName: {
                        value: event.target.value,
                        validation: event.target.value.length >= 3,
                      }
                    }))
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div className='w-full bg-input'>
                <input
                  className='input'
                  type="text"
                  placeholder='نام خانوادگی جدید'
                  value={editInformationForm.lastName.value}
                  onChange={event => {
                    setEditInformationForm(prev => ({
                      ...prev,
                      lastName: {
                        value: event.target.value,
                        validation: event.target.value.length >= 3,
                      }
                    }))
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div className='w-full bg-input'>
                <select
                  className='select-box'
                  value={editInformationForm.city.value}
                  onChange={event => {
                    setEditInformationForm(prev => ({
                      ...prev,
                      city: {
                        value: event.target.value,
                        validation: true,
                      }
                    }))
                  }}
                >
                  {
                    allCities.map(city => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))
                  }
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <button
                className="btn btn-blue w-full"
                onClick={changeUserInformationHandler}
              >
                ثبت تغییر
              </button>
            </form>
          </PortalModal>
        )
      }

      <Toaster />
    </>
  )
}

export default AdminDashboard