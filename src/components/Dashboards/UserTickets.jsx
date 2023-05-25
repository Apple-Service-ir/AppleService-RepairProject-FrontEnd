import React, { useRef, useState, useContext, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'

import AuthContext from './../../context/AuthContext'
import Alert from '../Alert/Alert'
import UserTicketModal from '../UserTicketModal/UserTicketModal'
import { get, post } from './../../utility'

function UserTickets() {
  const authContext = useContext(AuthContext)

  const [tickets, setTickets] = useState([])
  const [ticketModal, setTicketModal] = useState(false)

  const ticketTitleRef = useRef()
  const ticketTextRef = useRef()

  useEffect(() => {
    authContext.userToken &&
      get(`/tickets/all?token=${authContext.userToken}`)
        .then(response => {
          console.log(response);
          response.data.ok && setTickets(response.data.tickets)
        })
  }, [authContext])

  function closeTicketModal() {
    setTicketModal(false)
  }

  function submitTicketHandler() {
    post('/tickets/new', {
      token: authContext.userToken,
      subject: ticketTitleRef.current.value.trim(),
      text: ticketTextRef.current.value.trim()
    }).then(response => {
      if (response.data.ok) {
        toast.success('تیکت با موفقیت ثبت شد!')
        closeTicketModal()
      } else toast.error(response.data.error)
    })
  }

  return (
    <>
      <div className='w-full flex flex-col justify-center items-center gap-6'>
        <div className="w-full flex flex-col justify-center items-center gap-3 p-3">
          <button className='btn btn-blue'
            onClick={() => setTicketModal(true)}>ثبت تیکت جدید</button>
        </div>

        {
          tickets.length === 0 && (
            <Alert
              theme={'danger'}
              title={'شما هیچ تیکتی ندارید!'}
              icon={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
            />
          )
        }

        <h2 className='w-full text-right text-xl sansbold'>لیست تیکت ها</h2>
        <div className="w-full rounded-xl overflow-x-scroll
        lg:overflow-hidden">
          <table className='table'>
            <thead className='thead'>
              <tr className='thead__tr'>
                <th className='thead__tr__th w-2/12'>کد تیکت</th>
                <th className='thead__tr__th w-2/12'>وضعیت</th>
                <th className='thead__tr__th w-6/12'>موضوع تیکت</th>
                <th className='thead__tr__th w-2/12'>تاریخ</th>
              </tr>
            </thead>
            <tbody className='tbody'>
              {
                tickets.map(ticket => (
                  <tr className='tbody__tr cursor-pointer'>
                    <td className='tbody__tr__td w-2/12'>
                      <div className='w-full flex flex-wrap items-center gap-3 justify-center'>
                        <button className='badge badge-blue select-text'>
                          <span>{ticket.id}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className='tbody__tr__td w-2/12'>
                      <div className="td__wrapper">
                        <span className='text-xs'>
                          {ticket.status === 'pending' ? 'در انتظار پاسخ' : ''}
                        </span>
                      </div>
                    </td>
                    <td className='tbody__tr__td w-6/12 text-sm'>{ticket.subject}</td>
                    <td className='tbody__tr__td w-2/12 text-sm'>
                      {new Date(ticket.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {
        ticketModal &&
        <UserTicketModal
          closeModal={closeTicketModal}
        >
          <div className="bg-white shadow-2xl w-[75vw] flex flex-col justify-center items-center gap-6 p-6
            rounded-xl">
            <div className="w-full flex flex-col gap-3 p-3 rounded-xl">
              <div className='w-full bg-input'>
                <input className='input'
                  type="text" placeholder='عنوان تیکت' ref={ticketTitleRef} />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
              </div>
              <div className='w-full bg-textarea'>
                <textarea className='textarea' placeholder='متن را وارد کنید' ref={ticketTextRef}></textarea>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-textarea">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
              </div>
              <button className='btn btn-out-blue w-1/2'
                onClick={submitTicketHandler}>ثبت تیکت</button>
            </div>
          </div>
        </UserTicketModal>
      }

      <Toaster />
    </>
  )
}

export default UserTickets