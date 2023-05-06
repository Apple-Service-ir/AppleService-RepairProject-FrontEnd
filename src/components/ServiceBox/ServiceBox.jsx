import React from 'react'

export function ServiceBox(props) {
    return (
        <div className="bg-slate-200 shadow-sm shadow-[#25252535] w-40 max-w-[11rem] flex justify-center items-center gap-3 py-3 rounded-md
        hover:shadow-xl sm:w-72 sm:max-w-[18rem] sm:px-10">
            {props.svg}
            <span className="text-slate-700 irsB sm:text-xl">{props.title}</span>
        </div>
    )
}