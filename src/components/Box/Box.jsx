import React from 'react'

export default function Box(props) {
  return (
    <div onClick={props.clickHandler} className={`${props.width} bg-slate-200 text-blue-500 border-2 border-slate-300
      h-16 relative flex items-center rounded-xl text-sm sm:text-base p-3
      hover:border-slate-400
      ${props.allow ? 'cursor-pointer' : 'opacity-50 pointer-events-none'}`}>
      {props.name}
      <div className='w-10 h-10 flex justify-center items-center absolute left-3 top-1/2 -translate-y-1/2'>
        {props.svg}
      </div>
    </div>
  )
}