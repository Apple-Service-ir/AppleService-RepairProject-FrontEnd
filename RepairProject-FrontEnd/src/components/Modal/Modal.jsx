import React from 'react'

export default function Modal(props) {
  function clickHandler(event) {
    event.target.dataset.close === 'true' && props.closeModal()
  }
  return (
    <div className='backdrop-blur-sm w-screen h-screen flex justify-center items-center
      fixed top-0 left-0 z-50' data-close='true' onClick={clickHandler}>
      <div className="bg-white shadow-sm shadow-slate-400 w-72
        flex flex-col items-center gap-6 rounded-xl p-5">
        <h1 className='text-slate-700 text-xl text-center'>{props.title}</h1>
        <div className="w-full max-h-96 flex flex-col items-center gap-3
          overflow-y-scroll">
          {props.children}
        </div>
      </div>
    </div>
  )
}