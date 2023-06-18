import React, { useContext, useRef, useEffect } from 'react'

import AuthContext from '../../context/AuthContext'
import { post } from '../../utility'
import { toast, Toaster } from 'react-hot-toast'

function MessageSection({ setTickets, currentTicket, setCurrentTicket, bottomRef, closeTicketHandler }) {
  const authcontext = useContext(AuthContext)
  const sendMessageRef = useRef()

  useEffect(() => {
    bottomRef.current.scrollTop = bottomRef.current.scrollHeight
  }, [currentTicket])

  function sendMassageHandler(ticketId) {
    if (sendMessageRef.current.value.length > 0) {
      post('/tickets/messages/new',
        {
          ticketId,
          text: sendMessageRef.current.value,
          token: authcontext.userToken
        }
      ).then(response => {
        bottomRef.current.scrollTop = bottomRef.current.scrollHeight + 100
        setTickets((prev) => {
          const mapedTickets = prev.map(ticket => {
            if (ticket.id === ticketId) {
              setCurrentTicket(response.data.ticket)
              return ticket = response.data.ticket
            }
            return ticket
          })
          console.log(mapedTickets);
          return mapedTickets
        })

        sendMessageRef.current.value = ''
      }).catch((err) => {
        toast.error(err.response.data.err)
      })
    }
  }

  return (
    <div className='bg-white w-full h-full absolute top-0 left-0 rounded-xl
      flex justify-center items-center'>

      <div className="bg-blue-500 w-full h-12 flex justify-between items-center
        rounded-t-xl px-6 absolute top-0 left-0 z-50">
        <span className='text-white sansbold'>
          {currentTicket.subject}
        </span>
        {
          currentTicket.clientId == authcontext.userInfo.id ? (
            <div className='flex items-center'>
              <button onClick={closeTicketHandler} className='ml-3 text-xs btn btn-danger p-1 rounded-md h-8'>بستن تیکت</button>
              <span className='text-white sansbold'>{currentTicket.id} #</span>
            </div>
          ) : (
            <span className='text-white sansbold'>{currentTicket.id} #</span>
          )
        }

      </div>

      <div
        className={`w-full h-full mt-auto overflow-y-scroll px-3 pt-[3.75rem]
          ${currentTicket.status !== 'closed' && 'pb-[4.75rem]'}`}
        ref={bottomRef}
      >
        {
          currentTicket.messages ? (
            currentTicket.messages.map(message => {
              return message.isSupport ? (
                <div key={message.id} className="w-full flex justify-end p-1">
                  <div className="bg-blue-200 w-max max-w-[80%] p-3 relative mt-5 chat-l">
                    <span className='text-blue-500 text-xs absolute left-2 -top-5'>پشتیبان</span>
                    <p className='text-sm break-words
                      sm:text-base'>{message.text}</p>
                  </div>
                </div>
              ) : (
                <div key={message.id} className="w-full p-1">
                  <div className="bg-green-200 w-max max-w-[80%] p-3 relative chat-r">
                    <p className='text-sm break-words
                      sm:text-base'>{message.text}</p>
                  </div>
                </div>
              )
            })
          ) : ''
        }
      </div>

      {
        currentTicket.status !== 'closed' && (
          <div className="bg-white w-full h-16 flex justify-between items-end gap-3 p-3
            rounded-b-xl absolute bottom-0 left-0">
            <button
              className='bg-blue-500 text-white w-16 h-12 rounded-full
            flex justify-center items-center'
              onClick={() => sendMassageHandler(currentTicket.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                className="w-6 h-6 -rotate-90">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
            <div className='w-full bg-input'>
              <input
                className='input rounded-xl'
                type="text"
                placeholder='تایپ کنید'
                ref={sendMessageRef}
              />
            </div>
          </div>
        )
      }

      <Toaster />
    </div>
  )
}

export default MessageSection