import React from 'react'
import { Link } from 'react-router-dom'

export default function Btn(props) {
  console.log(props.bgColor);
  return (
    <Link className={`${props.bgColor} ${props.color} ${props.border}
      flex justify-center items-center gap-2 text-xl rounded-full py-2 px-7
      ${props.hoverBgColor} ${props.hoverColor} ${props.hoverBorder}`}>
      {props.text}
      {props.svg}
    </Link>
  )
}