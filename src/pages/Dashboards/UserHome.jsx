import React, {useEffect} from 'react'

function UserHome() {
  useEffect(() => {
    document.title = "داشبورد - اپل سرویس"
  }, [])  

  return (
    <div className='w-full flex flex-col items-center show-fade'>
      UserHome
    </div>
  )
}

export default UserHome