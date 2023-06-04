import React, { useEffect, useRef, useState, useContext } from 'react'
import { createPortal } from 'react-dom';
import toast, { Toaster } from 'react-hot-toast';

import { get, postForm } from '../../utility';
import AuthContext from './../../context/AuthContext'

import PortalModal from './../../components/PortalModal/PortalModal'
import FileInput from '../../components/FileInput/FileInput'
import SelectBox from '../../components/SelectBox/SelectBox'
import TeaxtArea from '../../components/TextArea/TeaxtArea'

export default function Order() {
  const authContext = useContext(AuthContext)

  const [datas, setDatas] = useState({ all: [], brands: [], devices: [], parts: [], cities: [] })
  const [selectedDatas, setSelectedDatas] = useState({ devices: {}, parts: {} })
  const [modals, setModals] = useState({ brands: false, devices: false, parts: false })

  const deviceRef = useRef()
  const citiesRef = useRef()
  const fileWrapperRef = useRef()
  const fileRef = useRef()
  const nameFileRef = useRef()
  const addressRef = useRef()
  const descRef = useRef()

  useEffect(() => {
    get('/list/devices').then(response => {
      const mapped = response.data.phones.map(item => {
        return { id: item.id, value: `${item.brand} ${item.model}`, brand: item.brand }
      })
      setDatas(prev => ({ ...prev, all: mapped }))
      setDatas(prev => ({ ...prev, brands: response.data.brands }))
    })

    get('/list/parts').then(response => {
      const mapped = response.data.map(item => ({ id: item.id, value: item.name }))
      setDatas(prev => ({ ...prev, parts: mapped }))
    })

    get('/list/cities').then(response => {
      setDatas(prev => ({ ...prev, cities: response.data }))
    })
  }, [])

  function postOrder() {
    const formData = new FormData()
    formData.append('token', authContext.userToken)
    formData.append('address', addressRef.current.value)
    formData.append('city', citiesRef.current.value)
    formData.append('phoneId', selectedDatas.devices.id)
    formData.append('partId', selectedDatas.parts.id)
    formData.append('description', descRef.current.value)
    formData.append('picture', fileRef.current.files[0]);

    postForm('/orders/submit', formData).then(response => {
      if (response.data.ok) {
        setSelectedDatas(prev => ({ ...prev, devices: {} }))
        setSelectedDatas(prev => ({ ...prev, parts: {} }))
        citiesRef.current.value = 'none'
        nameFileRef.current.innerHTML = 'تصویر دستگاه خود را بارگذاری کنید'
        addressRef.current.value = ''
        descRef.current.value = ''
        toast.success('سفارش شما با موفقیت ثبت شد')
      } else toast.error(response.data.err)
    })
  }

  return (
    <>
      <div className='container flex flex-col justify-center items-center gap-3 mx-auto my-6 px-5
        sm:px-0'>
        <div className="w-full flex flex-col justify-center items-center gap-3
          sm:flex-row">
          <div ref={deviceRef} onClick={() => setModals(prev => ({ ...prev, brands: true }))}
            className='w-full bg-slate-200 text-blue-500 border-2 border-slate-300
            h-16 relative flex items-center rounded-xl text-sm sm:text-base p-3 select-none cursor-pointer
            hover:border-slate-400 sm:w-1/2'>
            {
              selectedDatas.devices.value
                && selectedDatas.parts.value
                ? `${selectedDatas.devices.value} - ${selectedDatas.parts.value.split(' - ')[1]}`
                : 'مدل دستگاه خود را انتخاب کنید'
            }
            <div className='w-10 h-10 flex justify-center items-center absolute left-3 top-1/2 -translate-y-1/2'>
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
          </div>
          <SelectBox
            selectRef={citiesRef}
            width='w-full sm:w-1/2'
            name='شهرتان را انتخاب کنید'
            options={datas.cities}
            svg={(
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            )}
          />
        </div>
        <FileInput
          inputWrapperRef={fileWrapperRef}
          inputRef={fileRef}
          nameFileRef={nameFileRef}
          width='w-full'
          name='تصویر دستگاه خود را بارگذاری کنید'
          svg={(
            <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          )}
        />
        <div className="w-full flex flex-col justify-center items-center gap-3
          sm:flex-row">
          <TeaxtArea
            textRef={addressRef}
            width='w-full sm:w-1/2'
            resize='resize-none'
            placeholder='آدرس دقیق محل زندگی'
            svg={(
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            )}
          />
          <TeaxtArea
            textRef={descRef}
            width='w-full sm:w-1/2'
            resize='resize-y'
            placeholder='در مورد مشکل دستگاه و تعمیر آن توضیح دهید'
            svg={(
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            )}
          />
        </div>
        <button className='btn btn-out-green w-1/2 mt-3
          sm:w-1/3' onClick={postOrder}>ثبت سفارش</button>
      </div>

      {
        modals.brands && (
          createPortal(
            <PortalModal
              closeHandler={() => setModals(prev => ({ ...prev, brands: false }))}
            >
              <ul className="bg-white w-96 max-h-[80vh] overflow-y-scroll p-3 rounded-xl">
                <span className='w-full block text-center text-xl sansbold p-1'>
                  برند را انتخاب کنید
                </span>
                {
                  datas.brands.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setDatas(prev => ({
                          ...prev,
                          devices: datas.all.filter(device => device.brand === item)
                        }))
                        setModals({ brands: false, devices: true, parts: false })
                      }}
                      className='bg-slate-200 w-full p-3 mt-2 rounded-xl first:mt-0
                        flex justify-center items-center cursor-pointer hover:bg-slate-300'
                    >
                      {item}
                    </li>
                  ))
                }
              </ul>
            </PortalModal>,
            document.body
          )
        )
      }

      {
        modals.devices && (
          createPortal(
            <PortalModal
              closeHandler={() => setModals(prev => ({ ...prev, devices: false }))}
            >
              <ul className="bg-white w-96 max-h-[80vh] overflow-y-scroll p-3 rounded-xl">
                <span className='w-full block text-center text-xl sansbold p-1'>
                  دستگاه را انتخاب کنید
                </span>
                {
                  datas.devices.map(item => (
                    <li
                      key={item.id}
                      onClick={() => {
                        setSelectedDatas(prev => ({ ...prev, devices: item }))
                        setModals({ brands: false, devices: false, parts: true })
                      }}
                      className='bg-slate-200 w-full p-3 mt-2 rounded-xl first:mt-0
                        flex justify-center items-center cursor-pointer hover:bg-slate-300'
                    >
                      {item.value}
                    </li>
                  ))
                }
              </ul>
            </PortalModal>,
            document.body
          )
        )
      }

      {
        modals.parts && (
          createPortal(
            <PortalModal
              closeHandler={() => setModals(prev => ({ ...prev, parts: false }))}
            >
              <ul className="bg-white w-96 max-h-[80vh] overflow-y-scroll p-3 rounded-xl">
                <span className='w-full block text-center text-xl sansbold p-1'>
                  قطعه تعمیری را انتخاب کنید
                </span>
                {
                  datas.parts.map(item => (
                    <li
                      key={item.id}
                      onClick={() => {
                        setSelectedDatas(prev => ({ ...prev, parts: item }))
                        setModals(prev => ({ ...prev, parts: false }))
                      }}
                      className='bg-slate-200 w-full p-3 mt-2 rounded-xl first:mt-0
                        flex justify-center items-center cursor-pointer hover:bg-slate-300'
                    >
                      {item.value}
                    </li>
                  ))
                }
              </ul>
            </PortalModal>,
            document.body
          )
        )
      }
      <Toaster />
    </>
  )
}