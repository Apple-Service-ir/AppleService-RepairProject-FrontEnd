import React from 'react'

export default function SelectBox(props) {
  return (
    <div className={`${props.width} h-16 relative`}>
      <select onChange={props.inputHandler} style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
        ref={props.selectRef}
        className="bg-slate-200 text-blue-500 border-2 border-slate-300
        w-full h-full flex items-center absolute top-0 left-0 p-3 pl-16 rounded-xl text-sm sm:text-base
      	cursor-pointer hover:border-slate-400 focus:outline-0 focus:border-slate-400">
        <option className='text-blue-500' value="none">{props.name}</option>
        {
          props.options.map(option => (
            <option className='text-blue-500' key={option.id} value={option.id}>{option.name}</option>
          ))
        }
      </select>
      <div className='w-10 h-10 flex justify-center items-center absolute left-3 top-1/2 -translate-y-1/2'>
        {props.svg}
      </div>
    </div>
  )
}