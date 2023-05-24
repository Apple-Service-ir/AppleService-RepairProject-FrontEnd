import React from 'react'

function UserTicketModal(props) {

  function clickHandler(event) {
    event.target.dataset.close === 'true' && props.closeModal()
  }

  return (
    <div className='backdrop-blur-sm w-screen h-screen flex justify-center items-center
      fixed top-0 left-0 z-50' data-close='true' onClick={clickHandler}>
      {props.children}
    </div>
  )
}

export default UserTicketModal