import React, { useState, useEffect, useContext } from 'react'

import AuthContext from './../../context/AuthContext'
import PortalModal from '../../components/PortalModal/PortalModal'
import { get, post } from '../../utility'
import { toast, Toaster } from 'react-hot-toast'

function AdminDevices() {
  const authContext = useContext(AuthContext)

  const [showDeviceForm, setShowDeviceForm] = useState(false)

  const [datas, setDatas] = useState({ brands: [], devices: [] })
  const [deviceForm, setDeviceForm] = useState({
    model: { value: '', validation: false },
    selectBrand: { value: '', validation: false },
    newBrand: { value: '', validation: false }
  })
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (authContext.userToken) {
      get('/list/devices')
        .then(response => {
          setDatas(prev => ({
            ...prev,
            brands: response.data.brands,
            devices: response.data.phones,
          }))
        })
        .catch(error => toast.error(error.response.data.err))
    }
  }, [authContext])

  const submitHandler = event => {
    event.preventDefault()
    if (deviceForm.selectBrand.validation && deviceForm.model.validation) {
      const requestBody = {
        token: authContext.userToken,
        brand: deviceForm.selectBrand.value,
        model: deviceForm.model.value
      }
      post('/admins/devices/create', requestBody)
        .then(response => {
          setDatas(prev => ({
            ...prev,
            devices: [response.data.device, ...prev.devices]
          }))
          setDeviceForm({
            model: { value: '', validation: false },
            selectBrand: { value: '', validation: false },
            newBrand: { value: '', validation: false }
          })
          toast.success('دستگاه با موفقیت اضافه شد')
        })
        .catch(error => toast.error(error.response.data.err))
    }
    else toast.error('لطفا فیلد هارا کامل کنید')
  }

  const createNewBrand = () => {
    if (deviceForm.newBrand.validation) {
      setDatas(prev => {
        const newBrands = [deviceForm.newBrand.value, ...prev.brands]
        return { ...prev, brands: newBrands }
      })
      setDeviceForm(prev => ({
        ...prev,
        newBrand: { value: '', validation: false }
      }))
    }
  }

  return (
    <>
      <div className='w-full flex flex-col items-center show-fade'>
        <div className="w-full">
          <button
            className='btn btn-blue'
            onClick={() => setShowDeviceForm(prev => !prev)}
          >
            {showDeviceForm ? 'بستن' : 'ساخت دستگاه جدید'}
            {
              showDeviceForm ? (
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
          showDeviceForm && (
            <form className='w-full flex flex-col justify-center items-center gap-3 mt-3 show-fade'>
              <div className="w-full flex flex-col justify-center items-center gap-3
                sm:flex-row">
                <div className='w-full bg-input
                  sm:w-1/2'>
                  <div
                    className='input cursor-pointer'
                    type="text"
                    onClick={() => (setShowModal(true))}
                  >
                    {
                      deviceForm.selectBrand.value || 'برند دستگاه'
                    }
                  </div>
                  <svg className="svg-input" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <div className='w-full bg-input
                  sm:w-1/2'>
                  <input
                    className='input'
                    type="text"
                    placeholder='مدل'
                    value={deviceForm.model.value}
                    onChange={event => {
                      setDeviceForm(prev => ({
                        ...prev,
                        model: {
                          value: event.target.value,
                          validation: event.target.value.length > 1
                        }
                      }))
                    }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>
              </div>
              <button
                className='btn btn-blue w-full
                  sm:w-1/2'
                type='submit'
                onClick={submitHandler}
              >
                اضافه کردن
              </button>
            </form>
          )
        }

        <h1 className='w-full text-right text-xl sansbold mt-6'>لیست دستگاه ها</h1>
        {
          datas.devices.length > 0 && (
            <div className="w-full overflow-x-auto rounded-xl mt-1">
              <table className='table'>
                <thead className='thead'>
                  <tr className='thead__tr'>
                    <th className='thead__tr__th w-2/12'>ID</th>
                    <th className='thead__tr__th w-4/12'>برند</th>
                    <th className='thead__tr__th w-4/12'>مدل</th>
                    <th className='thead__tr__th w-1/12'>ویرایش</th>
                    <th className='thead__tr__th w-1/12'>حذف</th>
                  </tr>
                </thead>
                <tbody className='tbody'>
                  {
                    datas.devices.map(device => (
                      <tr
                        key={device.id}
                        className='tbody__tr'
                      >
                        <td className='tbody__tr__td w-2/12'>
                          <div className='w-full flex flex-wrap items-center gap-3 justify-center'>
                            <button className='badge badge-blue select-text'>{device.id} #</button>
                          </div>
                        </td>
                        <td className='tbody__tr__td w-4/12'>{device.brand}</td>
                        <td className='tbody__tr__td w-4/12 text-sm'>{device.model}</td>
                        <td
                          className='tbody__tr__td w-1/12 group cursor-pointer'
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
          )
        }
      </div>

      {
        showModal && (
          <PortalModal closeHandler={() => {
            setDeviceForm(prev => ({ ...prev, newBrand: { value: '', validation: false } }))
            setShowModal(false)
          }}>
            <div className="bg-white w-96 max-h-[80vh] p-3 rounded-xl">
              <span className='w-full block text-center text-xl sansbold p-1'>
                برند را انتخاب کنید
              </span>
              <div className='w-full bg-input mb-4 mt-1'>
                <input
                  className='input'
                  type="text"
                  placeholder='جستجو کنید'
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <ul className='w-full max-h-[12rem] overflow-y-scroll'>
                {
                  datas.brands.map((device, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setDeviceForm(prev => ({
                          ...prev,
                          selectBrand: { value: device, validation: true }
                        }))
                        setShowModal(false)
                      }}
                      className='bg-slate-200 w-full p-3 mt-2 rounded-xl
                      flex justify-center items-center cursor-pointer hover:bg-slate-300'
                    >
                      {device}
                    </li>
                  ))
                }
              </ul>
              <div className="w-full flex-col justify-center items-center gap-2 mt-4">
                <div className='w-full bg-input my-2'>
                  <input
                    className='input'
                    type="text"
                    placeholder='اسم برند'
                    value={deviceForm.newBrand.value}
                    onChange={event => {
                      setDeviceForm(prev => ({
                        ...prev,
                        newBrand: {
                          value: event.target.value,
                          validation: event.target.value.length > 1,
                        }
                      }))
                    }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <button
                  className="btn btn-blue w-full"
                  onClick={createNewBrand}
                >
                  اصافه کردن برند جدید
                </button>
              </div>
            </div>
          </PortalModal>
        )
      }

      <Toaster />
    </>
  )
}

export default AdminDevices