import React from 'react'
import { Link } from 'react-router-dom'

export default function Btn(props) {
  return (
    <Link to={props.href} onClick={props.clickHandler}
    className={`${props.width} ${props.bgColor} ${props.color} ${props.border}
      flex justify-center items-center gap-2 rounded-full py-2 px-7
      ${props.hoverBgColor} ${props.hoverColor} ${props.hoverBorder}`}>
      {props.text}
      {props.svg}
    </Link>
  )
}