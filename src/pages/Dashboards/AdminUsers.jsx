import React, { useContext, useEffect } from 'react'

import AuthContext from './../../context/AuthContext'
import { get } from './../../utility'
import { useState } from 'react'

function AdminUsers() {
  const authContext = useContext(AuthContext)

  const [users, setUsers] = useState([])

  useEffect(() => {
    if (authContext.userToken) {
      get(`/admins/users/all?token=${authContext.userToken}`)
        .then(response => {
          if (response.data.ok) {
            setUsers(response.data.users)
          }
          console.log(response);
        })
    }
  }, [authContext])

  return (
    <div className='w-full h-full flex flex-col items-center'>
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
  )
}

export default AdminUsers