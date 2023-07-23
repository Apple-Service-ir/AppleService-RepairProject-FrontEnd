import React, { useEffect, useRef, useState, useContext } from 'react'
import toast, { Toaster } from 'react-hot-toast';

import { get, postForm } from '../../utils/connection';
import AuthContext from './../../context/AuthContext'
import DataContext from './../../context/DataContext'
import LoadingContext from './../../context/LoadingContext'
import PortalModal from './../../components/PortalModal/PortalModal'
import SubmitBtn from '../../components/SubmitBtn/SubmitBtn';

export default function Order() {
  const authContext = useContext(AuthContext)
  const loadingContext = useContext(LoadingContext)
  const dataContext = useContext(DataContext)

  const [datas, setDatas] = useState({ all: [], brands: [], devices: [], parts: [] })
  const [selectedDatas, setSelectedDatas] = useState({ devices: {}, parts: {} })
  const [modals, setModals] = useState({ brands: false, devices: false, parts: false })
  const [form, setForm] = useState({
    city: { value: '', validation: true },
    file: { value: null, fileName: 'تصویر دستگاه خود را بارگذاری کنید', validation: false },
    address: { value: '', validation: false },
    desc: { value: '', validation: false },
  })
  const [submitLoading, setSubmitLoading] = useState(false)

  const fileRef = useRef()


  useEffect(() => {
    const func = async () => {
      document.title = "ثبت سفارش - اپل سرویس"

      await get('/list/devices')
        .then(response => {
          const mapped = response.data.phones.map(item => {
            return { id: item.id, value: `${item.brand} ${item.model}`, brand: item.brand }
          })
          setDatas(prev => ({ ...prev, all: mapped, brands: response.data.brands }))
        })

      await get('/list/parts')
        .then(response => {
          const mapped = response.data.map(item => ({ id: item.id, value: item.name }))
          setDatas(prev => ({ ...prev, parts: mapped }))
        })

      loadingContext.setProgressIsLoadingHandler(false)
    }

    func()
  }, [])

  const postOrder = async () => {
    setSubmitLoading(true)

    for (const field in form)
      if (!form[field].validation) {
        setSubmitLoading(false)
        return toast.error('لطفا فیلد هارا به درستی وارد کنید')
      }

    const formData = new FormData()
    formData.append('address', form.address.value)
    formData.append('city', form.city.value || dataContext.cities[0].id)
    formData.append('phoneId', selectedDatas.devices.id)
    formData.append('partId', selectedDatas.parts.id)
    formData.append('description', form.desc.value)
    formData.append('picture', form.file.value);
    await postForm('/orders/submit', authContext.userToken, formData)
      .then(() => {
        setSelectedDatas(prev => ({ ...prev, devices: {}, parts: {} }))
        setForm(prev => ({
          ...prev,
          file: { value: null, fileName: 'تصویر دستگاه خود را بارگذاری کنید', validation: false },
          address: { value: '', validation: false },
          desc: { value: '', validation: false },
        }))
        toast.success('سفارش شما با موفقیت ثبت شد')
      })
      .catch(error => toast.error(error.response.data.err))

    setSubmitLoading(false)
  }

  return (
    <>
      <div className='container flex flex-col justify-center items-center gap-3 mx-auto my-6 px-5
        sm:px-0'>
        <div className="w-full flex flex-col justify-center items-center gap-3
          sm:flex-row">
          <div className='w-full bg-input
            sm:w-1/2'>
            <div
              className='input cursor-pointer'
              type="text"
              onClick={() => {
                setModals(prev => ({ ...prev, brands: true }))
              }}
            >
              {
                selectedDatas.devices.value
                  && selectedDatas.parts.value
                  ? `${selectedDatas.devices.value} - ${selectedDatas.parts.value.split(' - ')[1]}`
                  : 'مدل دستگاه خود را انتخاب کنید'
              }
            </div>
            <svg className="svg-input" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>

          <div className='w-full bg-input
            sm:w-1/2'>
            <select
              className='select-box'
              value={form.city.value}
              onChange={event => {
                setForm(prev => ({
                  ...prev,
                  city: {
                    value: event.target.value,
                    validation: true
                  }
                }))
              }}
            >
              {
                dataContext.cities.map(city => (
                  <option
                    key={city.id}
                    value={city.id}
                  >
                    {city.name}
                  </option>
                ))
              }
            </select>
            <svg className="svg-input" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
        </div>

        <div className='w-full bg-input'>
          <div
            className='input cursor-pointer'
            onClick={() => {
              fileRef.current.click()
            }}
          >
            <span className='truncate'>
              {form.file.fileName}
            </span>
            <input
              className='hidden'
              ref={fileRef}
              type="file"
              onChange={event => {
                setForm(prev => ({
                  ...prev,
                  file: {
                    value: event.target.files[0],
                    fileName: event.target.files[0].name,
                    validation: !!event.target.files[0]
                  }
                }))
              }}
            />
          </div>
          <svg className="svg-input" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>

        <div className="w-full flex flex-col justify-center items-center gap-3
          sm:flex-row">
          <div className='w-full bg-textarea
            sm:w-1/2'>
            <textarea
              className='textarea'
              placeholder='آدرس دقیق محل زندگی'
              value={form.address.value}
              onChange={event => {
                setForm(prev => ({
                  ...prev,
                  address: {
                    value: event.target.value,
                    validation: event.target.value.length >= 3
                  }
                }))
              }}
            >
            </textarea>
            <svg className="svg-textarea" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>

          <div className='w-full bg-textarea
            sm:w-1/2'>
            <textarea
              className='textarea'
              placeholder='در مورد مشکل دستگاه و تعمیر آن توضیح دهید'
              value={form.desc.value}
              onChange={event => {
                setForm(prev => ({
                  ...prev,
                  desc: {
                    value: event.target.value,
                    validation: event.target.value.length >= 3
                  }
                }))
              }}
            >
            </textarea>
            <svg className="svg-textarea" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
        </div>
        <SubmitBtn
          customClass={'w-1/2 sm:w-1/3'}
          isLoading={submitLoading}
          clickHandler={postOrder}
        >
          ثبت سفارش
        </SubmitBtn>
      </div>

      {
        modals.brands && (
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
          </PortalModal>
        )
      }

      {
        modals.devices && (
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
          </PortalModal>
        )
      }

      {
        modals.parts && (
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
          </PortalModal>
        )
      }
      <Toaster />
    </>
  )
}