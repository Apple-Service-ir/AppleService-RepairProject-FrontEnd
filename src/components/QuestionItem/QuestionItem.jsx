import React from 'react'

export function QuestionItem(props) {
  return (
    <div className="w-full bg-slate-200 shadow-sm shadow-slate-400
      flex flex-col justify-center items-center rounded-xl
      sm:w-96">
      <div className="w-full flex justify-between items-center p-3 sm:p-5 pb-3 sm:pb-5">
        <h6 className="text-slate-700 sansbold">{props.title}</h6>
        {props.svg}
      </div>
      <p className="text-slate-500 w-full p-3 pt-0 text-sm sm:p-5 sm:pt-0">
        {props.description}
      </p>
    </div>
  )
}