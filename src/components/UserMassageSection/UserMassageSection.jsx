import React from 'react'

function UserMassageSection({ showMassageSection, closeMassageSection }) {
  return (
    <div className={`${showMassageSection ? 'flex' : 'hidden'}
      bg-white border-blue-500 border w-full h-full absolute top-0 right-0 rounded-xl z-50 show-scale-x
      flex flex-col justify-between items-center`}>
      <div className="bg-blue-500 w-full h-16 flex justify-between items-center rounded-t-xl px-6">
        <span className='text-white sansbold'>
          <span className='ml-3'>#22035</span>
          چگونه سفارشی ثبت کنم؟
        </span>
        <button>
          <svg onClick={closeMassageSection}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"    className="stroke-white w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default UserMassageSection