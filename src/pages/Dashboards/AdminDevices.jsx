import React, { useState, useEffect } from 'react'

import PortalModal from '../../components/PortalModal/PortalModal'
import { get } from '../../utility'

function AdminDevices() {
  const [deviceForm, setDeviceForm] = useState(false)

  const [datas, setDatas] = useState({ brands: [], devices: [] })
  const [selectBrand, setSelectBrand] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    get('/list/devices')
      .then(response => {
        setDatas(prev => ({
          ...prev,
          brands: response.data.brands,
          devices: response.data.phones,
        }))
      })
  }, [])

  return (
    <>
      <div className='w-full flex flex-col items-center show-fade'>
        <div className="w-full">
          <button
            className='btn btn-blue'
            onClick={() => setDeviceForm(prev => !prev)}
          >
            {deviceForm ? 'بستن' : 'ساخت کاربر'}
            {
              deviceForm ? (
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
          deviceForm && (
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
                      selectBrand || 'برند دستگاه'
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
              >
                اضافه کردن
              </button>
            </form>
          )
        }
      </div>

      {
        showModal && (
          <PortalModal closeHandler={() => setShowModal(false)}>
            <ul className="bg-white w-96 max-h-[80vh] overflow-y-scroll p-3 rounded-xl">
              <span className='w-full block text-center text-xl sansbold p-1'>
                مدل را انتخاب کنید
              </span>
              {
                datas.brands.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setSelectBrand(item)
                      setShowModal(false)
                    }}
                    className='bg-slate-200 w-full p-3 mt-2 rounded-xl first:mt-0
                      flex justify-center items-center cursor-pointer hover:bg-slate-300'
                  >
                    {item}
                  </li>
                ))
              }
            </ul>
          </PortalModal>
        )
      }
    </>
  )
}

export default AdminDevices