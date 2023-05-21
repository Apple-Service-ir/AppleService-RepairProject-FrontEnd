import React from 'react'

export function HeroItem(props) {
    return (
        <div className="bg-slate-200 w-full h-max flex flex-col items-center justify-center gap-10
        rounded-xl p-5 sm:h-1/2 sm:flex-row lg:w-1/2 lg:h-full">
            <img className="w-32" src={props.image} alt={props.title} />
            <div className="flex justify-center flex-col gap-3">
                <span className="text-slate-600 sansbold text-3xl text-center sm:text-right">{props.title}</span>
                <span className="text-slate-400 text-center sm:text-right">{props.description}</span>
            </div>
        </div>
    )
}