import React, { useState, useEffect, useContext } from 'react'
import { toast, Toaster } from 'react-hot-toast'

import { get, post } from '../../utils/connection'
import AuthContext from './../../context/AuthContext'
import LoadingContext from './../../context/LoadingContext'
import PortalModal from '../../components/PortalModal/PortalModal'
import Alert from '../../components/Alert/Alert'
import SubmitBtn from '../../components/SubmitBtn/SubmitBtn'
import DeleteIconLoader from '../../components/DeleteIconLoader/DeleteIconLoader'

function AdminDevices() {
  const authContext = useContext(AuthContext)
  const loadingContext = useContext(LoadingContext)

  const [showDeviceForm, setShowDeviceForm] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [editDeviceModal, setEditDeviceModal] = useState({ show: false, id: null, brand: '', model: '' })
  const [datas, setDatas] = useState({ brands: [], devices: [] })
  const [deviceForm, setDeviceForm] = useState({
    model: { value: '', validation: false },
    selectBrand: { value: '', validation: false },
    newBrand: { value: '', validation: false }
  })
  const [createDeviceLoading, setCreateDeviceLoading] = useState(false)
  const [deleteDeviceLoading, setDeleteDeviceLoading] = useState({ isLoading: false, id: null })
  const [editDeviceLoading, setEditDeviceLoading] = useState(false)

  useEffect(() => {
    document.title = "مدیریت دستگاه ها - داشبورد مدیریت اپل سرویس"
    get('/list/devices')
      .then(response => {
        setDatas(prev => ({
          ...prev,
          brands: response.data.brands,
          devices: response.data.phones,
        }))
      })
      .finally(() => loadingContext.setProgressIsLoadingHandler(false))
  }, [])

  const getDatas = () => {
    get('/list/devices')
      .then(response => {
        setDatas(prev => ({
          ...prev,
          brands: response.data.brands,
          devices: response.data.phones,
        }))
      })
  }

  const submitHandler = async event => {
    event.preventDefault()
    if (deviceForm.selectBrand.validation && deviceForm.model.validation) {
      setCreateDeviceLoading(true)

      const devicesMap = datas.devices.map(d => d.model.toLowerCase())
      if (devicesMap.includes(deviceForm.model.value.toLowerCase())) {
        setCreateDeviceLoading(false)
        return toast.error("مدل وارد شده از قبل ثبت شده است.")
      }

      const requestBody = {
        brand: deviceForm.selectBrand.value,
        model: deviceForm.model.value
      }
      await post('/admins/devices/create', authContext.userToken)
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

      setCreateDeviceLoading(false)
    }
    else toast.error('لطفا فیلد هارا کامل کنید')
  }

  const createNewBrand = () => {
    if (deviceForm.newBrand.validation) {
      if (datas.brands.map(b => b.toLowerCase()).includes(deviceForm.newBrand.value.toLowerCase())) return toast.error("برند وارد شده از قبل ساخته شده است.")

      setDatas(prev => {
        return { ...prev, brands: [deviceForm.newBrand.value, ...prev.brands] }
      })
      setDeviceForm(prev => ({
        ...prev,
        newBrand: { value: '', validation: false }
      }))
    }
  }

  const removeDevice = async deviceId => {
    const requestBody = {
      id: deviceId
    }
    await post('/admins/devices/delete', authContext.userToken, requestBody)
      .then(() => {
        getDatas()
        toast.success('دستگاه با موفقیت حذف شد')
      })
      .catch(error => toast.error(error.response.data.err))

    setDeleteDeviceLoading({ isLoading: false, id: null })
  }

  const editDevice = async event => {
    event.preventDefault()

    if (editDeviceModal.brand.length < 1 || editDeviceModal.model.length < 1) return toast.error('لطفا فیلد هارا کامل کنید')

    setEditDeviceLoading(true)

    const requestBody = {
      id: editDeviceModal.id,
      data: { brand: editDeviceModal.brand, model: editDeviceModal.model }
    }
    await post('/admins/devices/edit', authContext.userToken, requestBody)
      .then(() => {
        getDatas()
        setEditDeviceModal({ show: false, id: null, brand: '', model: '' })
        toast.success('دستگاه با موفقیت ویرایش شد')
      }).catch(error => { toast.error(error.response.data.err) })

    setEditDeviceLoading(false)
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
                    className='input cursor-pointer ltr'
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
                    dir='ltr'
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
              <SubmitBtn
                customClass={'w-full sm:w-1/2'}
                clickHandler={submitHandler}
                isLoading={createDeviceLoading}
              >
                اضافه کردن
              </SubmitBtn>
            </form>
          )
        }

        <h1 className='w-full text-right text-xl sansbold mt-6'>لیست دستگاه ها</h1>
        {
          datas.devices.length > 0 ? (
            <div className="w-full overflow-x-auto rounded-xl mt-3">
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
                        <td className='tbody__tr__td w-4/12 ltr text-right'>{device.brand}</td>
                        <td className='tbody__tr__td w-4/12 text-sm ltr text-right'>{device.model}</td>
                        <td
                          className='tbody__tr__td w-1/12 group cursor-pointer'
                          onClick={() => {
                            setEditDeviceModal(
                              { show: true, id: device.id, brand: device.brand, model: device.model }
                            )
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
                          onClick={() => {
                            setDeleteDeviceLoading({ isLoading: true, id: device.id })
                            removeDevice(device.id)
                          }}
                        >
                          <div className="td__wrapper justify-center">
                            <DeleteIconLoader
                              customClass={'group-hover:-translate-y-1'}
                              isLoading={deleteDeviceLoading.isLoading && (deleteDeviceLoading.id === device.id)}
                            />
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
              title={'دستگاهی ثبت نشده است'}
            />
          )
        }
      </div >

      {
        showModal && (
          <PortalModal
            closeHandler={() => {
              setDeviceForm(prev => ({ ...prev, newBrand: { value: '', validation: false } }))
              setShowModal(false)
            }}>
            <div className="bg-white w-96 max-h-[80vh] p-3 rounded-xl">
              <span className='w-full block text-center text-xl sansbold p-1'>
                برند را انتخاب کنید
              </span>
              <ul className='w-full max-h-[20rem] overflow-y-scroll'>
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

      {
        editDeviceModal.show && (
          <PortalModal
            closeHandler={() => setEditDeviceModal({ show: false, brand: '', model: '' })}
          >
            <form className="bg-white w-96 flex flex-col justify-center items-center gap-3 p-3 rounded-xl">
              <div className='w-full bg-input'>
                <input
                  className='input'
                  type="text"
                  placeholder='برند جدید'
                  value={editDeviceModal.brand}
                  onChange={event => {
                    setEditDeviceModal(prev => (
                      { ...prev, brand: event.target.value }
                    ))
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div className='w-full bg-input'>
                <input
                  className='input'
                  type="text"
                  placeholder='مدل جدید'
                  value={editDeviceModal.model}
                  onChange={event => {
                    setEditDeviceModal(prev => (
                      { ...prev, model: event.target.value }
                    ))
                  }}
                />
                <svg className="svg-input" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>

              </div>
              <SubmitBtn
                customClass={'w-full'}
                clickHandler={editDevice}
                isLoading={editDeviceLoading}
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

export default AdminDevices