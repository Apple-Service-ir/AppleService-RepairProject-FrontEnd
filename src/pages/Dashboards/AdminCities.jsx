import React, { useEffect, useState, useContext } from 'react'
import { toast, Toaster } from 'react-hot-toast'

import { get, post } from '../../utility'
import AuthContext from '../../context/AuthContext'
import Alert from '../../components/Alert/Alert'
import PortalModal from '../../components/PortalModal/PortalModal'

function AdminCities() {
  const authContext = useContext(AuthContext)

  const [showCitiesForm, setShowCitiesForm] = useState(false)
  const [cityName, setCityName] = useState({ value: '', validation: false })
  const [cities, setCities] = useState([])
  const [modal, setModal] = useState({ show: false, city: {} })
  const [editCityName, setEditCityName] = useState({ value: '', validation: false })

  useEffect(() => {
    document.title = "مدیریت شهر ها - داشبورد مدیریت اپل سرویس"

    get('/list/cities')
      .then(response => setCities(response.data))
      .catch(error => toast.error(error.response.data.err))
  }, [])

  const addCityHandler = event => {
    event.preventDefault()

    const englishWords = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm']

    if (!cityName.validation) return toast.error('لطفا فیلد را کامل کنید')
    if (englishWords.includes(cityName.value)) return toast.error('اسم شهر باید فقط حروف فارسی باشد.')

    if (cities.map(city => city.name).includes(cityName.value)) return toast.error("این شهر از قبل ثبت شده است.")

    const requestBody = {
      token: authContext.userToken,
      name: cityName.value
    }
    post('/admins/cities/create', requestBody)
      .then(response => {
        setCities(prev => [response.data.city, ...prev])
        toast.success('شهر با موفقیت اضافه شد')
      })
      .catch(error => toast.error(error.response.data.err))
  }

  const removeCityHandler = cityId => {
    const requestBody = {
      token: authContext.userToken,
      id: cityId
    }
    post('/admins/cities/delete', requestBody)
      .then((r) => {
        setCities(prev => {
          return prev.filter(city => city.id !== cityId)
        })
        toast.success('شهر با موفقیت حذف شد')
      })
      .catch(error => toast.error(error.response.data.err))
  }

  const editCityNameHandler = event => {
    event.preventDefault()
    if (!editCityName.validation) return toast.error('لطفا فیلد را کامل کنید')
    const requestBody = {
      token: authContext.userToken,
      id: modal.city.id,
      data: { name: editCityName.value },
    }
    post('/admins/cities/edit', requestBody)
      .then(() => {
        setCities(prev => {
          const newCities = prev.map(city => {
            if (city.id === modal.city.id) city.name = editCityName.value
            return city
          })
          return newCities
        })
        toast.success('شهر با موفقیت ویرایش شد')
      })
      .catch(error => toast.error(error.response.data.err))
  }

  return (
    <>
      <div className='w-full flex flex-col items-center show-fade'>
        <div className="w-full">
          <button
            className='btn btn-blue'
            onClick={() => setShowCitiesForm(prev => !prev)}
          >
            {showCitiesForm ? 'بستن' : 'افزودن شهر جدید'}
            {
              showCitiesForm ? (
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
          showCitiesForm && (
            <form className='w-full flex justify-center items-center gap-3 mt-3 show-fade'>
              <div className='w-full bg-input
                sm:w-1/2'>
                <input
                  className='input'
                  type="text"
                  placeholder='نام شهر'
                  value={cityName.value}
                  onChange={event => {
                    setCityName({
                      value: event.target.value,
                      validation: event.target.value.length > 1
                    })
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                </svg>
              </div>
              <button
                className='btn btn-blue w-full
                sm:w-1/2'
                type='submit'
                onClick={addCityHandler}
              >
                اضافه کردن
              </button>
            </form>
          )
        }

        <h1 className='w-full text-right text-xl sansbold mt-6'>لیست شهر ها</h1>
        {
          cities.length > 0 ? (
            <div className="w-full overflow-x-auto rounded-xl mt-3">
              <table className='table'>
                <thead className='thead'>
                  <tr className='thead__tr'>
                    <th className='thead__tr__th w-2/12'>ID</th>
                    <th className='thead__tr__th w-8/12'>نام شهر</th>
                    <th className='thead__tr__th w-1/12'>ویرایش</th>
                    <th className='thead__tr__th w-1/12'>حذف</th>
                  </tr>
                </thead>
                <tbody className='tbody'>
                  {
                    cities.map(city => (
                      <tr
                        key={city.id}
                        className='tbody__tr'
                      >
                        <td className='tbody__tr__td w-2/12'>
                          <div className='w-full flex flex-wrap items-center gap-3 justify-center'>
                            <button className='badge badge-blue select-text'>{city.id} #</button>
                          </div>
                        </td>
                        <td className='tbody__tr__td w-8/12 text-sm'>{city.name}</td>
                        <td
                          className='tbody__tr__td w-1/12 group cursor-pointer'
                          onClick={() => {
                            setModal({ show: true, city: city })
                            setEditCityName({ value: city.name, validation: true })
                          }}
                        >
                          <div className="td__wrapper justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-blue-500 w-5 h-5
                            group-hover:-translate-y-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </div>
                        </td>
                        <td
                          className='tbody__tr__td w-1/12 group cursor-pointer'
                          onClick={() => removeCityHandler(city.id)}
                        >
                          <div className="td__wrapper justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-red-500 w-5 h-5
                            group-hover:-translate-y-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
              title={'شهر ای ثبت نشده است.'}
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
        modal.show && (
          <PortalModal
            closeHandler={() => setModal({ show: false, city: {} })}
          >
            <form className="bg-white w-96 flex flex-col justify-center items-center gap-3 p-3 rounded-xl">
              <div className='w-full bg-input'>
                <input
                  className='input'
                  type="text"
                  placeholder='نام جدید شهر'
                  value={editCityName.value}
                  onChange={event => {
                    setEditCityName({
                      value: event.target.value,
                      validation: event.target.value.length > 1
                    })
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                </svg>
              </div>
              <button
                className='btn btn-blue w-full'
                onClick={editCityNameHandler}
              >ثبت تغییر</button>
            </form>
          </PortalModal>
        )
      }

      <Toaster />
    </>
  )
}

export default AdminCities