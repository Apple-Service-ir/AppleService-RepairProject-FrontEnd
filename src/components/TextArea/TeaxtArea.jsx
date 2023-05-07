import React from 'react'

export default function TeaxtArea(props) {
  return (
    <div className={`${props.width} h-48 relative`}>
      <textarea className={`bg-slate-200 text-blue-500 border-2 border-slate-300
        w-full h-48 absolute top-0 left-0 p-3 pl-16 rounded-xl text-sm sm:text-base ${props.resize}
      focus:border-slate-400 focus:outline-0 placeholder:text-blue-500
        placeholder:text-sm sm:placeholder:text-base`}
        placeholder={props.placeholder}>
      </textarea>
      <div className='w-10 h-10 flex justify-center items-center absolute left-3 top-7 -translate-y-1/2'>
        {props.svg}
      </div>
    </div>
  )
}