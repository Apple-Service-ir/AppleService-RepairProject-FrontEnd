import React from 'react'
import { Link } from 'react-router-dom'

function Alert({ theme, title, link, linkTitle, icon }) {
  return (
    <div className={theme === 'danger' ? 'alert-danger' : ''}>
      <div className='flex justify-center items-center gap-3'>
        <h1 className='text-base sm:text-xl'>{title}</h1>
        {
          (link && linkTitle) && (
            <Link
              className='text-black underline text-sm'
              to={link}
            >
              {linkTitle}
            </Link>
          )
        }
      </div>
      {
        theme === 'danger' ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        ) : ''
      }
    </div>
  )
}

export default Alert