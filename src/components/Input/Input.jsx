import React from 'react'

export default function Input(props) {
  return (
    <div className={`${props.width} h-16 relative`}>
      <input className='bg-slate-200 text-blue-500 border-2 border-slate-300
        w-full h-full absolute top-0 left-0 p-3 pl-16 rounded-xl text-sm sm:text-base
        focus:border-slate-400 focus:outline-0 placeholder:text-blue-500
        placeholder:text-sm sm:placeholder:text-base' type="text" placeholder={props.placeholder} />
      <div className='w-10 h-10 flex justify-center items-center absolute left-3 top-1/2 -translate-y-1/2'>
        {props.svg}
      </div>
    </div>
  )
}