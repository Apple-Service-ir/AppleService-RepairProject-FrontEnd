import React, { useEffect, useContext } from 'react'

import LoadingContext from './../../context/LoadingContext'

function RepairManHome() {
  const loadingContext = useContext(LoadingContext)

  useEffect(() => {
    loadingContext.setProgressIsLoadingHandler(false)
  }, [])

  return (
    <div>پنل تعمیر کار</div>
  )
}

export default RepairManHome