import React, { useContext } from 'react'
import { useRef } from 'react'
import { Toaster, toast } from 'react-hot-toast'

import AuthContext from '../../context/AuthContext'
import { post } from '../../utility'

function UserMassageSection({ showMassageSection, closeMassageSection, setTickets, ticket }) {
  const authContext = useContext(AuthContext)

  const sendMessageRef = useRef()

  function sendMassageHandler(ticketId) {
    if (sendMessageRef.current.value.length > 0) {
      post('/tickets/messages/new',
        {
          ticketId,
          text: sendMessageRef.current.value,
          token: authContext.userToken
        }
      ).then(response => {
        if (response.data.ok) {
          setTickets((prev) => {
            const mapedTickets = prev.filter(ticket => {
              if (ticket.id === ticketId) ticket.messages.push(response.data.message)
            })

            return mapedTickets
          })
          sendMessageRef.current.value = ''
        } else toast.error(response.data.err)
      })
    }
  }

  return (
    <div id='test' className={`${showMassageSection ? 'flex' : 'hidden'}
      bg-white border-blue-500 border w-full h-full absolute top-0 right-0 rounded-xl z-50 show-left-full
      flex flex-col justify-between items-center`}>
      <div className="bg-blue-500 w-full h-16 flex justify-between items-center rounded-t-xl px-6">
        <span className='text-white sansbold'>
          <span className='ml-3'>#22035</span>
          چگونه سفارشی ثبت کنم؟
        </span>
        <button>
          <svg onClick={closeMassageSection}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-white w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
      </div>

      <div className="w-full h-full mt-auto overflow-y-scroll p-3">
        {
          ticket.messages ? (
            ticket.messages.map(message => {
              return message.isSupport ? (
                <div key={message.id} className="w-full flex justify-end p-1">
                  <div className="bg-blue-200 w-max max-w-[80%] p-3 rounded-md relative">
                    <span className='text-blue-500 text-xs absolute left-2 -top-5'>پشتیبان</span>
                    <p className='text-sm break-words
                      sm:text-base'>{message.text}</p>
                  </div>
                </div>
              ) : (
                <div key={message.id} className="w-full p-1">
                  <div className="bg-green-200 w-max max-w-[80%] p-3 rounded-md">
                    <p className='text-sm break-words
                      sm:text-base'>{message.text}</p>
                  </div>
                </div>
              )
            })
          ) : ''
        }
      </div>

      <div className="w-full flex justify-between items-center gap-3 p-3">
        <button className='btn btn-blue' onClick={() => sendMassageHandler(ticket.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            className="w-6 h-6 -rotate-90">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
        <div className='w-full bg-input'>
          <input
            className='input'
            type="text"
            placeholder='تایپ کنید'
            ref={sendMessageRef}
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
            stroke="currentColor"
            className="svg-input">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default UserMassageSection