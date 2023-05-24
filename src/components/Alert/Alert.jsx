import React from 'react'
import { Link } from 'react-router-dom'

function Alert({ theme, title, link, linkTitle, icon }) {
  return (
    <div className={theme === 'danger' ? 'alert-danger' : ''}>
      <div className='flex justify-center items-center gap-3'>
        <h1 className='text-xl'>{title}</h1>
        {
          (link && linkTitle) && (<Link to={link} className='text-black underline text-sm'>{linkTitle}</Link>)
        }
      </div>
      {
        icon
      }
    </div>
  )
}

export default Alert