import React from 'react'

export function QuestionItem(props) {
    return (
        <div className="w-[325px] bg-slate-200 shadow-sm shadow-slate-400 flex flex-col justify-center items-center rounded-xl
              sm:w-[425px]">
            <div className="w-full flex justify-between items-center p-3 sm:p-5 pb-3 sm:pb-5">
                <h6 className="text-xl text-slate-700 sansbold sm:text-2xl">{props.title}</h6>
                {props.svg}
            </div>
            <p className="text-slate-500 w-full p-3 pt-0 text-sm sm:text-base sm:p-5 sm:pt-0">
                {props.description}
            </p>
        </div>
    )
}