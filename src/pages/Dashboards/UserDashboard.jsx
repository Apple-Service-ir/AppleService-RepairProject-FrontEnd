import React, { useState, useContext } from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'
import { toast, Toaster } from 'react-hot-toast'

import AuthContext from '../../context/AuthContext'
import { post } from '../../utility'
import PortalModal from '../../components/PortalModal/PortalModal'
import useGetCities from './../../Hooks/useGetCities'
import SubmitBtn from './../../components/SubmitBtn/SubmitBtn'


function UserDashboard() {
  const userInfo = JSON.parse(localStorage.getItem('e-service-userInfo'))
  const authContext = useContext(AuthContext)

  const [defaultCity, allCities] = useGetCities()
  const [showEditInformationModal, setShowEditInformationModal] = useState(false)
  const [editInformationForm, setEditInformationForm] = useState({
    firstName: { value: userInfo.firstName, validation: true },
    lastName: { value: userInfo.lastName, validation: true },
    city: { value: userInfo.city, validation: true },
  })
  const [submitEditLoading, setSubmitEditLoading] = useState(false)

  const changeUserInformationHandler = async event => {
    setSubmitEditLoading(true)
    event.preventDefault()

    for (const field in editInformationForm)
      if (!editInformationForm[field].validation) {
        setSubmitEditLoading(false)
        return toast.error('لطفا فیلد ها را کامل کنید')
      }

    await post("/informations/edit", {
      token: authContext.userToken,
      data: JSON.stringify({
        firstName: editInformationForm.firstName.value,
        lastName: editInformationForm.lastName.value,
        city: editInformationForm.city.value || defaultCity.id
      })
    })
      .then(response => {
        authContext.setUserInfoHandler(response.data.user)
        localStorage.setItem('e-service-userInfo', JSON.stringify(
          response.data.user
        ))
        toast.success("اطلاعات شما با موفقیت بروز شد.")
      })
      .catch(error => toast.error(error.response.data.err))

    setShowEditInformationModal(false)
    setSubmitEditLoading(false)
  }

  return (
    <>
      <div className='w-screen flex flex-col
        lg:flex-row'>
        <div className="w-full p-6
          lg:w-3/12 lg:pl-3">
          <div className='bg-blue-500 w-full min-h-max flex flex-col items-center rounded-xl p-3'>
            <svg className='w-24 h-24' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.4" d="M18 18.86H17.24C16.44 18.86 15.68 19.17 15.12 19.73L13.41 21.42C12.63 22.19 11.36 22.19 10.58 21.42L8.87 19.73C8.31 19.17 7.54 18.86 6.75 18.86H6C4.34 18.86 3 17.53 3 15.89V4.97998C3 3.33998 4.34 2.01001 6 2.01001H18C19.66 2.01001 21 3.33998 21 4.97998V15.89C21 17.52 19.66 18.86 18 18.86Z" fill="white" />
              <path d="M11.9999 10.41C13.2868 10.41 14.33 9.36684 14.33 8.08002C14.33 6.79319 13.2868 5.75 11.9999 5.75C10.7131 5.75 9.66992 6.79319 9.66992 8.08002C9.66992 9.36684 10.7131 10.41 11.9999 10.41Z" fill="white" />
              <path d="M14.6792 15.0601C15.4892 15.0601 15.9592 14.1601 15.5092 13.4901C14.8292 12.4801 13.5092 11.8 11.9992 11.8C10.4892 11.8 9.16918 12.4801 8.48918 13.4901C8.03918 14.1601 8.5092 15.0601 9.3192 15.0601H14.6792Z" fill="white" />
            </svg>
            <span className='text-white border-blue-400 border-b w-full text-center text-xl sansbold
            tracking-wide flex justify-center items-center gap-3 py-1'>
              <div className='w-5 h-5 group cursor-pointer' onClick={() => setShowEditInformationModal(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-white w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              {authContext.userInfo.firstName} {authContext.userInfo.lastName}
            </span>
            <div className="w-full flex flex-col justify-center items-center gap-3 mt-3">
              <NavLink
                to='orders'
                className={link => link.isActive ? 'btn btn-white w-full' : 'btn btn-out-white w-full'}
              >
                سفارشات
              </NavLink>
              <NavLink
                to='tickets'
                className={link => link.isActive ? 'btn btn-white w-full' : 'btn btn-out-white w-full'}
              >
                تیکت پشتیبانی
              </NavLink>
              {
                ['admin', 'supporter'].includes(authContext.userInfo.role) && (
                  <NavLink
                    to='/admin'
                    className={link => link.isActive ? 'btn btn-white w-full' : 'btn btn-out-white w-full'}
                  >
                    داشبورد مدیریت
                  </NavLink>
                )
              }
              {
                authContext.userInfo.role === 'repairman' && (
                  <NavLink
                    to='repairman'
                    className={link => link.isActive ? 'btn btn-white w-full' : 'btn btn-out-white w-full'}
                  >
                    ناحیه تعمیرکار
                  </NavLink>
                )
              }
              <Link
                className='btn btn-danger w-full'
                onClick={authContext.logOut}
              >
                خروج از حساب
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full rounded-xl p-6 relative
          lg:w-9/12 lg:pr-3">
          {<Outlet />}
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
              <SubmitBtn
                customClass={'w-full'}
                clickHandler={changeUserInformationHandler}
                isLoading={submitEditLoading}
              >
                ثبت تغییر
              </SubmitBtn>
            </form>
          </PortalModal>
        )
      }

      <Toaster />
    </>
  )
}

export default UserDashboard