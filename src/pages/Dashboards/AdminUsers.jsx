import React, { useContext, useEffect } from 'react'

import AuthContext from './../../context/AuthContext'
import { get, post } from './../../utility'
import { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

function AdminUsers() {
  const authContext = useContext(AuthContext)

  const [cities, setCities] = useState([])
  const [users, setUsers] = useState([])
  const [userForm, setUserForm] = useState({
    firstName: { value: '', validation: false },
    lastName: { value: '', validation: false },
    phone: { value: '', validation: false },
    city: { value: '', validation: false },
  })

  useEffect(() => {
    get('/list/cities').then(response => {
      setCities(response.data)
    })

    if (authContext.userToken) {
      get(`/admins/users/all?token=${authContext.userToken}`)
        .then(response => {
          if (response.data.ok) {
            setUsers(response.data.users)
          }
        })
    }
  }, [authContext])

  function submitHandler(event) {
    event.preventDefault()
    for (const field in userForm) {
      if (!userForm[field].validation) {
        toast.error('لطفا فیلد هارا کامل پر کنید')
        return
      }
    }

    const bodyRequest = {
      token: authContext.userToken,
      firstName: userForm.firstName.value,
      lastName: userForm.lastName.value,
      phone: userForm.phone.value,
      city: userForm.city.value,
    }
    post('/admins/users/create', bodyRequest)
      .then(response => {
        console.log(response);
        setUsers(prev => [response.data.user, ...prev])
        setUserForm({
          firstName: { value: '', validation: false },
          lastName: { value: '', validation: false },
          phone: { value: '', validation: false },
          city: { value: '', validation: false }
        })
        toast.success('کاربر جدید با موفقیا ساخته شد')
      })
      .catch(error => toast.error(error.response.data.err))
  }

  return (
    <>
      <div className='w-full h-full flex flex-col items-center overflow-y-scroll'>
        <h1 className='w-full text-right text-xl sansbold'>ساخت کاربر</h1>
        <form className='w-full flex flex-col justify-center items-center gap-3 mt-3'>
          <div className="w-full flex justify-center items-center gap-3">
            <div className='w-1/2 bg-input'>
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
            <div className='w-1/2 bg-input'>
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
          <div className="w-full flex justify-center items-center gap-3">
            <div className='w-1/2 bg-input'>
              <input
                className='input tracking-[0.25rem] text-right' dir='ltr'
                type="number"
                placeholder='09*********'
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
            <div className='w-1/2 bg-input'>
              <select
                className='select-box'
                value={userForm.city.value}
                onChange={event => {
                  setUserForm(prev => ({
                    ...prev,
                    city: {
                      value: event.target.value,
                      validation: event.target.value !== 'none'
                    }
                  }))
                }}
              >
                <option value="none">شهرتان را انتخاب کنید</option>
                {
                  cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))
                }
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
              </svg>
            </div>
          </div>
          <button
            className='btn btn-blue w-1/2'
            type='submit'
            onClick={submitHandler}
          >
            ساخت کاربر
          </button>
        </form>

        <h1 className='w-full text-right text-xl sansbold mt-6'>لیست کاربران</h1>
        <div className="w-full rounded-xl overflow-x-scroll mt-3
        lg:overflow-hidden">
          {
            users.length > 0 && (
              <table className='table'>
                <thead className='thead'>
                  <tr className='thead__tr'>
                    <th className='thead__tr__th w-1/12'>ID</th>
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
                        className='tbody__tr cursor-pointer'
                      >
                        <td className='tbody__tr__td w-1/12'>
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
                                : 'کاربر'
                          }
                        </td>
                        <td className='tbody__tr__td w-2/12 text-sm'>{user.phone}</td>
                        <td className='tbody__tr__td w-1/12 group'>
                          <div className="td__wrapper justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:stroke-blue-500">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )
          }
        </div>
      </div>

      <Toaster />
    </>
  )
}

export default AdminUsers