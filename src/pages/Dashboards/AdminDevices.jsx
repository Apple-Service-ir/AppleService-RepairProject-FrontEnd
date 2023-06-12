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
            devices: [...prev.devices, response.data.device]
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