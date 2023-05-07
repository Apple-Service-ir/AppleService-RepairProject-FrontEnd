import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Btn from "./../../components/Btn/Btn"
import Input from '../../components/Input/Input'
import FileInput from '../../components/FileInput/FileInput'
import SelectBox from '../../components/SelectBox/SelectBox'
import TeaxtArea from '../../components/TextArea/TeaxtArea'

export default function Order() {
  const [devices, setDevices] = useState([])
  const [parts, setParts] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/list/devices')
      .then(response => {
        const mapped = response.data.map(item => ({ id: item.id, value: `${item.brand} ${item.model}` }))
        setDevices(mapped)
      })
  }, [])

  const changeHandler = (event) => {
    const value = event.target.value
    const brand = value.split(" ")[0]
    const model = value.replace(brand, "").trim()
    axios.get(`http://localhost:3000/list/parts?brand=${brand}&model=${model}`)
      .then(response => {
        const mapped = response.data.map(item => ({ id: item.id, value: item.name }))
        setParts(mapped)
      })
  }

  return (
    <div className='container mx-auto px-3 mt-16
      sm:p-0'>
      <div className="w-full flex flex-wrap justify-center">
        <div className="w-full flex flex-col gap-3
          md:w-1/2 md:pl-3">
          <Input
            width='w-full'
            placeholder='نام و نام خانوادگی'
            svg={(
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
              </svg>
            )}
          />
          <Input
            width='w-full'
            placeholder='شماره تماس'
            svg={(
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            )}
          />
          <SelectBox
            width='w-full'
            name='مدل دستگاهتان را انتخاب کنید'
            options={devices}
            svg={(
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
              </svg>
            )}
            inputHandler={changeHandler}
          />
          <SelectBox
            width='w-full'
            name='قطعه تعویضی را انتخاب کنید'
            options={parts}
            svg={(
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
              </svg>
            )}
          />
          <FileInput
            width='w-full'
            name='تصویر دستگاهتان را بارگذاری کنید'
            svg={(
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            )}
          />
        </div>
        <div className="w-full flex flex-col gap-3 mt-9
          md:w-1/2 md:m-0">
          <SelectBox
            width='w-full'
            name='شهرتان را انتخاب کنید'
            options={[
              { id: 1, value: 'تهران' },
              { id: 2, value: 'مشهد' },
              { id: 3, value: 'نیشابور' },
              { id: 4, value: 'اصفهان' }
            ]}
            svg={(
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            )}
          />
          <TeaxtArea
            width='w-full'
            resize='resize-none'
            placeholder='آدرس دقیق محل زندگی'
            svg={(
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            )}
          />
          <TeaxtArea
            width='w-full'
            resize='resize-y'
            placeholder='در مورد مشکل دستگاه و تعمیر آن توضیح دهید'
            svg={(
              <svg className="stroke-blue-500 w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            )}
          />
          <Btn
            href='/'
            width='w-full'
            bgColor='bg-white'
            color='text-green-500'
            border='border border-green-500'
            hoverBgColor='hover:bg-green-500'
            hoverColor='hover:text-white'
            text='ثبت سفارش'
          />
        </div>
      </div>
    </div>
  )
}
