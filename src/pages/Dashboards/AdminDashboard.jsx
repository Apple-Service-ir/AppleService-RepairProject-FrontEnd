import React, { useContext, useRef, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { toast, Toaster } from 'react-hot-toast'

import { postForm } from '../../utility'
import AuthContext from '../../context/AuthContext'
import useGetCities from './../../Hooks/useGetCities'
import AdminSideBarLink from '../../components/Dashboard/AdminSideBarLink'
import AdminSideBarMobile from '../../components/Dashboard/AdminMobileSideBarLink'
import PortalModal from './../../components/PortalModal/PortalModal'
import config from '../../../config.json'
import SubmitBtn from '../../components/SubmitBtn/SubmitBtn'

const userInfo = JSON.parse(localStorage.getItem('e-service-userInfo'))

function AdminDashboard() {
  const authContext = useContext(AuthContext)

  const [defaultCity, allCities] = useGetCities()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showEditInformationModal, setShowEditInformationModal] = useState(false)
  const [profileUrl, setProfileUrl] = useState('')
  const [editInformationForm, setEditInformationForm] = useState({
    profile: { file: userInfo.profile, validation: true },
    firstName: { value: userInfo.firstName, validation: true },
    lastName: { value: userInfo.lastName, validation: true },
    city: { value: '', validation: true },
  })
  const [submitEditLoading, setSubmitEditLoading] = useState(false)

  const profileRef = useRef()

  document.body.addEventListener('click', event => { event.target.dataset.mobilebtn !== 'true' && setShowMobileMenu(false) })

  const changeUserInformationHandler = async event => {
    setSubmitEditLoading(true)
    event.preventDefault()

    for (const field in editInformationForm)
      if (!editInformationForm[field].validation) {
        setSubmitEditLoading(false)
        return toast.error('لطفا فیلد ها را کامل کنید')
      }

    const requestForm = new FormData()
    requestForm.append('token', authContext.userToken)
    requestForm.append('picture', editInformationForm.profile.file)
    requestForm.append('data', JSON.stringify({
      firstName: editInformationForm.firstName.value,
      lastName: editInformationForm.lastName.value,
      city: editInformationForm.city.value || defaultCity.id
    }))

    await postForm("/informations/edit", requestForm).
      then(response => {
        console.log(response)
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

  const readUrl = file => {
    const reader = new FileReader()
    reader.addEventListener('load', event => {
      setProfileUrl(event.target.result)
    })
    reader.readAsDataURL(file)
  }

  return (
    <>
      <div className='w-screen h-screen flex overflow-hidden'>
        <div className="bg-blue-500 w-4/12 h-full hidden flex-col items-center gap-3 pb-3
          overflow-y-scroll hidden-bar
          sm:flex lg:w-2/12">
          <div className="flex flex-col justify-center items-center gap-3 p-3">
            <div className="bg-blue-400 w-28 h-28 rounded-full relative">
              {authContext.userInfo.profile && (
                <img
                  className='w-full h-full rounded-full
                    absolute top-0 left-0 object-cover object-top'
                  src={config.mainUrl.replace("/api", "") + `/uploads/` + authContext.userInfo.profile}
                />
              )}
            </div>
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
          <ul className='w-full flex flex-col justify-center items-center gap-3 pr-3 mt-6'>
            <AdminSideBarLink
              link={'/admin'}
              title={'داشبورد'}
              svg={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                  <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              )}
            />
            <AdminSideBarLink
              link={'users'}
              title={'کاربران'}
              svg={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                  <path className='duration-0' strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              )}
            />
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
            {(authContext.userInfo.role == "admin" && <>
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
                link={'cities'}
                title={'شهر ها'}
                svg={(
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                  </svg>
                )}
              />
            </>
            )
            }
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
                <ul
                  className='bg-blue-500 shadow-2xl w-72
                    flex flex-col justify-center items-center gap-3
                    p-6 rounded-xl absolute right-0 top-16 z-50 show-up'
                >
                  <div className="flex flex-col justify-center items-center gap-3">
                    <div className="bg-blue-400 w-20 h-20 rounded-full">
                      {authContext.userInfo.profile && (
                        <img className='h-full object-cover rounded-full' src={config.mainUrl.replace("/api", "") + `/uploads/` + authContext.userInfo.profile} />
                      )}
                    </div>
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
                  {
                    authContext.userInfo.role == "admin" && (<>
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
                      <AdminSideBarMobile
                        link={'cities'}
                        title={'شهر ها'}
                        svg={(
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="duration-0 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                          </svg>
                        )}
                      />
                    </>)
                  }
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
              <div
                className='bg-blue-100 w-32 h-32 flex justify-center items-center rounded-full cursor-pointer relative'
                onClick={() => {
                  profileRef.current.click()
                }}
                title='عکس پروفایل'
              >
                {
                  (editInformationForm.profile.file || authContext.userInfo.profile) && (
                    <img
                      className='w-full h-full rounded-full
                        absolute top-0 left-0 object-cover object-top show-fade'
                      src={profileUrl || config.mainUrl.replace("/api", "") + `/uploads/` + authContext.userInfo.profile}
                      alt="admin profile"
                    />
                  )
                }
                <input
                  className='hidden'
                  type="file"
                  ref={profileRef}
                  onChange={event => {
                    readUrl(event.target.files[0])
                    setEditInformationForm(prev => ({
                      ...prev,
                      profile: {
                        file: event.target.files[0],
                        validation: !!event.target.files[0]
                      }
                    }))
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                  className="stroke-blue-500 w-9 h-9">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
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

export default AdminDashboard