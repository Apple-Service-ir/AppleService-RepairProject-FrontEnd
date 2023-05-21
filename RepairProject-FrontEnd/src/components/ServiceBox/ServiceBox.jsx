import React from 'react'

export function ServiceBox(props) {
  return (
    <div className='w-1/2 p-1
      sm:w-1/3'>
      <div
        className="bg-slate-200 shadow-sm shadow-[#25252535] w-full flex justify-center items-center gap-2
        px-1 py-3 rounded-md
        hover:shadow-xl sm:px-10">
        {props.svg}
        <span className="text-slate-700 irsB text-sm select-none
          sm:text-xl">{props.title}</span>
      </div>
    </div>
  )
}