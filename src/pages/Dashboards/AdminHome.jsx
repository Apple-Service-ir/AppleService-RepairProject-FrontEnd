import React, {useEffect} from 'react'

function AdminHome() {
  useEffect(() => {
    document.title = "داشبورد مدیریت - اپل سرویس"
  }, [])

  return (
    <div className='w-full flex flex-col items-center'>
      AdminHome
    </div>
  )
}

export default AdminHome