import React, { useContext, useEffect, useRef, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

import config from '../../../config.json'
import AuthContext from './../../context/AuthContext'
import LoadingContext from './../../context/LoadingContext'
import { get, post, postForm } from './../../utility'
import Alert from '../../components/Alert/Alert'
import useGetCities from './../../Hooks/useGetCities'
import PortalModal from './../../components/PortalModal/PortalModal'
import SubmitBtn from '../../components/SubmitBtn/SubmitBtn'

function AdminUsers() {
  const authContext = useContext(AuthContext)
  const loadingContext = useContext(LoadingContext)

  const [defaultCity, allCities] = useGetCities()
  const [users, setUsers] = useState([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [profileUrl, setProfileUrl] = useState('')
  const [showEditInformationModal, setShowEditInformationModal] = useState({ show: false, id: null })
  const [userForm, setUserForm] = useState({
    firstName: { value: '', validation: false },
    lastName: { value: '', validation: false },
    phone: { value: '', validation: false },
    city: { value: '', validation: true },
    role: {
      value: 'user', validation: true, buttons: {
        user: { value: 'user', checked: true },
        supporter: { value: 'supporter', checked: false },
        repairman: { value: 'repairman', checked: false },
      }
    }
  })
  const [editInformationForm, setEditInformationForm] = useState({
    id: { value: '', validation: true },
    profile: { file: '', validation: true },
    firstName: { value: '', validation: true },
    lastName: { value: '', validation: true },
    phone: { value: '', validation: true },
    city: { value: '', validation: true },
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitEditLoading, setSubmitEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const profileRef = useRef()

  useEffect(() => {
    loadingContext.setProgressIsLoadingHandler(true)
    if (authContext.userToken) {
      document.title = "کاربران - داشبورد مدیریت اپل سرویس"
      get(`/admins/users/all?token=${authContext.userToken}`)
        .then(response => {
          setUsers(response.data.users)
        })
        .finally(() => loadingContext.setProgressIsLoadingHandler(false))
    }
  }, [authContext.userInfo])

  const submitHandler = async event => {
    setSubmitLoading(true)
    event.preventDefault()

    for (const field in userForm)
      if (!userForm[field].validation) {
        setSubmitLoading(false)
        return toast.error('لطفا فیلد هارا کامل پر کنید')
      }

    await post('/admins/users/create', {
      token: authContext.userToken,
      firstName: userForm.firstName.value,
      lastName: userForm.lastName.value,
      phone: userForm.phone.value,
      city: userForm.city.value || defaultCity.id,
      role: userForm.role.value
    })
      .then(response => {
        setUsers(prev => [response.data.user, ...prev])
        setUserForm({
          firstName: { value: '', validation: false },
          lastName: { value: '', validation: false },
          phone: { value: '', validation: false },
          city: { value: '', validation: true },
          role: {
            value: 'user', validation: true, buttons: {
              user: { value: 'user', checked: true },
              supporter: { value: 'supporter', checked: false },
              repairman: { value: 'repairman', checked: false },
            }
          }
        })
        toast.success('کاربر جدید با موفقیت ساخته شد')
      })
      .catch(error => toast.error(error.response.data.err))

    setSubmitLoading(false)
  }

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
    requestForm.append('id', editInformationForm.id.value)
    requestForm.append('data', JSON.stringify({
      firstName: editInformationForm.firstName.value,
      lastName: editInformationForm.lastName.value,
      city: editInformationForm.city.value || defaultCity.id
    }))

    await postForm("/informations/edit", requestForm)
      .then(response => {
        setUsers(prev => {
          const newUsers = prev.map(user => {
            if (user.id === editInformationForm.id.value) {
              return response.data.user
            }
            else {
              return user
            }
          })

          return newUsers
        })

        toast.success("با موفقیت انجام شد")
      }).catch((error) => {
        toast.error(error.response.data.err)
      })

    setShowEditInformationModal({ show: false, id: null })
    setSubmitEditLoading(false)
  }

  function editClickHandler(user) {
    setEditInformationForm({
      id: { value: user.id, validation: true },
      profile: { file: user.profile, validation: true },
      firstName: { value: user.firstName, validation: true },
      lastName: { value: user.lastName, validation: true },
      phone: { value: user.phone, validation: true },
      city: { value: user.city, validation: true },
    })
    setShowEditInformationModal({ show: true, id: user.id })
  }

  const deleteUserInformationHandler = async event => {
    setDeleteLoading(true)
    event.preventDefault()

    await post("/admins/users/delete", {
      token: authContext.userToken,
      id: editInformationForm.id.value
    }).then(() => {
      setUsers(prev => prev.filter(user => user.id !== editInformationForm.id.value))

      setEditInformationForm({
        id: { value: '', validation: true },
        profile: { file: '', validation: true },
        firstName: { value: '', validation: true },
        lastName: { value: '', validation: true },
        phone: { value: '', validation: true },
        city: { value: '', validation: true },
      })
      toast.success('کاربر با موفقیت حذف شد')
    }).catch(error => toast.error(error.response.data.err))

    setShowEditInformationModal({ show: false, id: null })
    setDeleteLoading(false)
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
      <div className='w-full flex flex-col items-center show-fade'>
        <div className="w-full">
          <button
            className='btn btn-blue'
            onClick={() => setShowUserForm(prev => !prev)}
          >
            {showUserForm ? 'بستن' : 'ساخت کاربر'}
            {
              showUserForm ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>

              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              )
            }
          </button>
        </div>
        {
          showUserForm && (
            <form className='w-full flex flex-col justify-center items-center gap-3 mt-3 show-fade'>
              <div className="w-full flex flex-col justify-center items-center gap-3
                sm:flex-row">
                <div className='w-full bg-input
                  sm:w-1/2'>
                  <input
                    className='input'
                    type="text"
                    placeholder='نام'
                    value={userForm.firstName.value}
                    onChange={event => {
                      setUserForm(prev => ({
                        ...prev,
                        firstName: {
                          value: event.target.value,
                          validation: event.target.value.length >= 3
                        }
                      }))
                    }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className='w-full bg-input
                  sm:w-1/2'>
                  <input
                    className='input'
                    type="text"
                    placeholder='نام خانوادگی'
                    value={userForm.lastName.value}
                    onChange={event => {
                      setUserForm(prev => ({
                        ...prev,
                        lastName: {
                          value: event.target.value,
                          validation: event.target.value.length >= 3
                        }
                      }))
                    }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
              </div>
              <div className="w-full flex flex-col justify-center items-center gap-3
                sm:flex-row">
                <div className='w-full bg-input
                  sm:w-1/2'>
                  <input
                    className='input tracking-[0.25rem] text-right' dir='ltr'
                    type="number"
                    placeholder='09*********'
                    inputMode='decimal'
                    min={0}
                    value={userForm.phone.value}
                    onChange={event => {
                      setUserForm(prev => ({
                        ...prev,
                        phone: {
                          value: event.target.value.slice(0, 11),
                          validation: (event.target.value.length === 11 && event.target.value.startsWith('09'))
                        }
                      }))
                    }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div className='w-full bg-input
                  sm:w-1/2'>
                  <select
                    className='select-box'
                    value={userForm.city.value}
                    onChange={event => {
                      setUserForm(prev => ({
                        ...prev,
                        city: {
                          value: event.target.value,
                          validation: true
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
              </div>
              <div className="w-full flex justify-center items-center gap-1 my-3">
                <label htmlFor="user">کاربر عادی</label>
                <input
                  className='ml-3'
                  type="radio"
                  id='user'
                  name='user-rank'
                  checked={userForm.role.buttons.user.checked}
                  value={userForm.role.buttons.user.value}
                  onChange={event => {
                    setUserForm(prev => ({
                      ...prev,
                      role: {
                        value: event.target.value, validation: true, buttons: {
                          user: { ...prev.role.buttons.user, checked: true },
                          supporter: { ...prev.role.buttons.supporter, checked: false },
                          repairman: { ...prev.role.buttons.repairman, checked: false }
                        }
                      }
                    }))
                  }}
                />
                <label htmlFor="repairman">تعمیر کننده</label>
                <input
                  className='ml-3'
                  type="radio"
                  id='repairman'
                  name='user-rank'
                  checked={userForm.role.buttons.repairman.checked}
                  value={userForm.role.buttons.repairman.value}
                  onChange={event => {
                    setUserForm(prev => ({
                      ...prev,
                      role: {
                        value: event.target.value, validation: true, buttons: {
                          user: { ...prev.role.buttons.user, checked: false },
                          supporter: { ...prev.role.buttons.supporter, checked: false },
                          repairman: { ...prev.role.buttons.repairman, checked: true }
                        }
                      }
                    }))
                  }}
                />
                <label htmlFor="supporter">پشتیبان</label>
                <input
                  className='ml-3'
                  type="radio"
                  id='supporter'
                  name='user-rank'
                  checked={userForm.role.buttons.supporter.checked}
                  value={userForm.role.buttons.supporter.value}
                  onChange={event => {
                    setUserForm(prev => ({
                      ...prev,
                      role: {
                        value: event.target.value, validation: true, buttons: {
                          user: { ...prev.role.buttons.user, checked: false },
                          supporter: { ...prev.role.buttons.supporter, checked: true },
                          repairman: { ...prev.role.buttons.repairman, checked: false }
                        }
                      }
                    }))
                  }}
                />
              </div>
              <SubmitBtn
                customClass={'w-full sm:w-1/2'}
                isLoading={submitLoading}
                clickHandler={submitHandler}
              >
                ساخت کاربر
              </SubmitBtn>
            </form>
          )
        }

        <h1 className='w-full text-right text-xl sansbold mt-6'>لیست کاربران</h1>
        {
          users.length > 0 ? (
            <div className="w-full overflow-x-auto rounded-xl mt-1">
              <table className='table'>
                <thead className='thead'>
                  <tr className='thead__tr'>
                    <th className='thead__tr__th w-2/12'>ID</th>
                    <th className='thead__tr__th w-3/12'>نام و نام خانوادگی</th>
                    <th className='thead__tr__th w-2/12'>شهر</th>
                    <th className='thead__tr__th w-2/12'>نقش</th>
                    <th className='thead__tr__th w-2/12'>شماره</th>
                    <th className='thead__tr__th w-1/12'>ویرایش</th>
                  </tr>
                </thead>
                <tbody className='tbody'>
                  {
                    users.map(user => (
                      <tr
                        key={user.id}
                        className='tbody__tr'
                      >
                        <td className='tbody__tr__td w-2/12'>
                          <div className='w-full flex flex-wrap items-center gap-3 justify-center'>
                            <button className='badge badge-blue select-text'>{user.id} #</button>
                          </div>
                        </td>
                        <td className='tbody__tr__td w-3/12'>{user.firstName} {user.lastName}</td>
                        <td className='tbody__tr__td w-2/12 text-sm'>{user.city}</td>
                        <td className='tbody__tr__td w-2/12 text-sm'>
                          {
                            user.role === 'admin' ? 'ادمین'
                              : user.role === 'supporter' ? 'پشتیبان'
                                : user.role === 'repairman' ? 'تعمیر کار'
                                  : 'کاربر'
                          }
                        </td>
                        <td className='tbody__tr__td w-2/12 text-sm'>{user.phone}</td>
                        <td
                          className='tbody__tr__td w-1/12 group cursor-pointer'
                          onClick={() => editClickHandler(user)}
                        >
                          <div className="td__wrapper justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-blue-500 w-5 h-5
                            group-hover:-translate-y-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          ) : (
            <Alert
              theme={'danger'}
              title={'قطعه ای ثبت نشده است.'}
              icon={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
            />
          )
        }
      </div>

      {
        showEditInformationModal.show && (
          <PortalModal
            closeHandler={() => setShowEditInformationModal({ show: false, id: null })}
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
                  (editInformationForm.profile.file) && (
                    <img
                      className='w-full h-full rounded-full
                        absolute top-0 left-0 object-cover object-top show-fade'
                      src={profileUrl || config.mainUrl.replace("/api", "") + '/uploads/' + editInformationForm.profile.file}
                      alt="user profile"
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
                <input
                  className='input'
                  type="text"
                  placeholder='شماره تلفن جدید'
                  value={editInformationForm.phone.value}
                  onChange={event => {
                    setEditInformationForm(prev => ({
                      ...prev,
                      phone: {
                        value: event.target.value,
                        validation: event.target.value.length >= 3,
                      }
                    }))
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
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
                isLoading={deleteLoading}
                clickHandler={deleteUserInformationHandler}
                type={'danger'}
              >
                حذف کاربر
              </SubmitBtn>
              <SubmitBtn
                customClass={'w-full'}
                isLoading={submitEditLoading}
                clickHandler={changeUserInformationHandler}
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

export default AdminUsers