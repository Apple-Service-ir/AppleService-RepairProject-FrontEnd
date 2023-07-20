import React, { useEffect, useContext } from 'react'

import LoadingContext from '../../context/LoadingContext'

function AdminHome() {
  const loadingContext = useContext(LoadingContext)

  useEffect(() => {
    document.title = "داشبورد مدیریت - اپل سرویس"
    loadingContext.setProgressIsLoadingHandler(false)
  }, [])

  return (
    <div className='w-full flex flex-col items-center'>
      AdminHome
    </div>
  )
}

export default AdminHome