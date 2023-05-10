import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Modal from '../../components/Modal/Modal'
import Btn from "./../../components/Btn/Btn"
import FileInput from '../../components/FileInput/FileInput'
import SelectBox from '../../components/SelectBox/SelectBox'
import TeaxtArea from '../../components/TextArea/TeaxtArea'

export default function Order() {
  const [brands, setBranads] = useState([])
  const [devices, setDevices] = useState([])
  const [allDevices, setAllDevices] = useState([])
  const [parts, setParts] = useState([])

  const [brandsModal, setBrandsModal] = useState(false)
  const [deviceModal, setDeviceModal] = useState(false)
  const [partsModal, setPartsModal] = useState(false)

  const [selectDevice, setSelectDevice] = useState({})
  const [selectPart, setSelectPart] = useState({})

  const [cities, setCities] = useState([])

  const fileRef = useRef()
  const citiesRef = useRef()
  const addressRef = useRef()
  const descRef = useRef()

  useEffect(() => {
    axios.get('http://192.168.1.123:3000/list/devices')
      .then(response => {
        setBranads(response.data.brands)
        const mapped = response.data.phones.map(item => {
          return { id: item.id, value: `${item.brand} ${item.model}`, brand: item.brand }
        })
        setAllDevices(mapped)
      })

    axios.get(`http://192.168.1.123:3000/list/parts`)
      .then(response => {
        const mapped = response.data.map(item => ({ id: item.id, value: item.name }))
        setParts(mapped)
      })

    axios.get('http://192.168.1.123:3000/list/cities')
      .then(response => {
        setCities(response.data)
      })
  }, [])

  function showBrandsModal() {
    setBrandsModal(true)
  }

  function closeAllModal() {
    setBrandsModal(false)
    setPartsModal(false)
    setDeviceModal(false)
  }

  function postOrder() {
    const items = [
      !!addressRef.current.value,
      !!selectDevice.id,
      !!selectPart.id,
      !!descRef.current.value,
      !!fileRef.current.files[0],
      citiesRef.current.value !== 'none'
    ]

    let orderStatus = true

    items.forEach((item, index) => {
      if (!item) {
        console.log(items[0], 'device');
        orderStatus = false
      }
    })

    console.log(orderStatus);
    // const formData = new FormData()
    // formData.append('userId', 2)
    // formData.append('address', addressRef.current.value)
    // formData.append('city', citiesRef.current.value)
    // formData.append('phoneId', selectDevice.id)
    // formData.append('partId', selectPart.id)
    // formData.append('description', descRef.current.value)
    // formData.append('picture', fileRef.current.files[0]);
    // axios({
    //   method: 'post',
    //   headers: { 'Content-Type': 'multipart/form-data' },
    //   url: 'http://192.168.1.123:3000/orders/submit',
    //   data: formData,
    // }).then(response => console.log(response))
  }

  return (
    <>
      <div className='container flex flex-col justify-center items-center gap-3 mx-auto mt-7 px-3
      sm:p-0'>
        <div className="w-full flex justify-center items-center gap-3">
          <div onClick={showBrandsModal} className='w-1/2 bg-slate-200 text-blue-500 border-2 border-slate-300
            h-16 relative flex items-center rounded-xl text-sm sm:text-base p-3 select-none cursor-pointer
            hover:border-slate-400'>
            {
              selectDevice.value && selectPart.value ? `${selectDevice.value} - ${selectPart.value.split(' - ')[1]}` : 'مدل دستگاه خود را انتخاب کنید'
            }
            <div className='w-10 h-10 flex justify-center items-center absolute left-3 top-1/2 -translate-y-1/2'>
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
          </div>
          <SelectBox
            selectRef={citiesRef}
            width='w-1/2'
            name='شهرتان را انتخاب کنید'
            options={cities}
            svg={(
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            )}
          />
        </div>
        <FileInput
          inputRef={fileRef}
          width='w-full'
          name='تصویر دستگاه خود را بارگذاری کنید'
          svg={(
            <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          )}
        />
        <div className="w-full flex justify-center items-center gap-3">
          <TeaxtArea
            textRef={addressRef}
            width='w-1/2'
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
            width='w-1/2'
            resize='resize-y'
            placeholder='در مورد مشکل دستگاه و تعمیر آن توضیح دهید'
            svg={(
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            )}
          />
        </div>
        <Btn
          type='btn'
          clickHandler={postOrder}
          width='w-1/3'
          bgColor='bg-white'
          color='text-green-500'
          border='border border-green-500'
          hoverBgColor='hover:bg-green-500'
          hoverColor='hover:text-white'
          text='ثبت سفارش'
        />
      </div>
      {
        brandsModal &&
        <Modal closeModal={closeAllModal} title='برند مورد نظرتان را انتخاب کنید'>
          {
            brands.map((item, index) => (
              <div key={index} onClick={() => {
                setDevices(() => {
                  const filtered = allDevices.filter(device => device.brand === item)
                  return filtered
                })
                closeAllModal();
                setDeviceModal(true);
              }}
                className='bg-slate-200 shadow-sm shadow-slate-400 w-full p-3
                rounded-md flex justify-center items-center cursor-pointer hover:bg-slate-300'>
                {item}
              </div>
            ))
          }
        </Modal>
      }
      {
        deviceModal &&
        <Modal closeModal={closeAllModal} title='دستگاه های مورد نطرتان را انتخاب کنید'>
          {
            devices.map(item => (
              <div key={item.id} onClick={() => {
                setSelectDevice(item)
                closeAllModal();
                setPartsModal(true)
              }}
                className='bg-slate-200 shadow-sm shadow-slate-400 w-full p-3
                rounded-md flex justify-center items-center cursor-pointer hover:bg-slate-300'>
                {item.value}
              </div>
            ))
          }
        </Modal>
      }
      {
        partsModal &&
        <Modal closeModal={closeAllModal} title='چه چیزی می خواهید تعمیر شود'>
          {
            parts.map(item => (
              <div key={item.id} onClick={() => {
                setSelectPart(item);
                closeAllModal();
              }}
                className='bg-slate-200 shadow-sm shadow-slate-400 w-full p-3
                    rounded-md flex justify-center items-center cursor-pointer hover:bg-slate-300'>
                {item.value}
              </div>
            ))
          }
        </Modal>
      }
    </>
  )
}