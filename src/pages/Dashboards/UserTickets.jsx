import React, { useRef, useState, useContext, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'

import AuthContext from '../../context/AuthContext'
import Alert from '../../components/Alert/Alert'
import { get, post } from '../../utility'
import UserMassageSection from '../../components/UserMassageSection/UserMassageSection'

function UserTickets() {
  const authContext = useContext(AuthContext)

  const [tickets, setTickets] = useState([])
  const [selectTicket, setSelectTicket] = useState([])

  const ticketTitleRef = useRef()
  const ticketTextRef = useRef()

  const [showMassageSection, seTshowMassageSection] = useState(false)
  const bottomRef = useRef()

  useEffect(() => {
    authContext.userToken &&
      get(`/tickets/all?token=${authContext.userToken}`)
        .then(response => {
          response.data.ok && setTickets(response.data.tickets)
        })
  }, [authContext])

  function submitTicketHandler() {
    if (ticketTitleRef.current.value.trim().length > 4 && ticketTextRef.current.value.trim().length > 4) {
      post('/tickets/new', {
        token: authContext.userToken,
        subject: ticketTitleRef.current.value.trim(),
        text: ticketTextRef.current.value.trim()
      }).then(response => {
        if (response.data.ok) {
          setTickets(response.data.tickets)
          toast.success('تیکت با موفقیت ثبت شد!')
          ticketTitleRef.current.value = ''
          ticketTextRef.current.value = ''
        } else toast.error(response.data.error)
      })
    } else toast.error('لطفا فیلد هارا به درستی پر کنید!')
  }

  function closeMassageSection() {
    seTshowMassageSection(false)
  }

  function openMessageHandler(ticket) {
    seTshowMassageSection(true)
    setSelectTicket(ticket)
    setTimeout(() => {
      bottomRef.current.scrollTop = bottomRef.current.scrollHeight
    }, 0);
  }

  useEffect(() => {
    bottomRef.current.scrollTop = bottomRef.current.scrollHeight
  }, [tickets]);

  return (
    <>
      <div className='w-full flex flex-col justify-center items-center gap-3 relative'>
        <div className="w-full flex flex-col justify-center items-center gap-3 p-3">
          <div className='w-full bg-input'>
            <input
              className='input'
              type="text"
              placeholder='عنوان تیکت'
              ref={ticketTitleRef}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
          </div>
          <div className='w-full bg-textarea'>
            <textarea
              className='textarea'
              placeholder='متن خود را وارد کنید'
              ref={ticketTextRef}
            >
            </textarea>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-textarea">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </div>
          <div className="w-full">
            <button className='btn btn-blue w-1/2
              sm:w-1/3'
              onClick={submitTicketHandler}>ثبت تیکت</button>
          </div>
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

        {
          tickets.length > 0 && (
            <>
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
                        <tr
                          key={ticket.id}
                          className='tbody__tr cursor-pointer'
                          onClick={() => openMessageHandler(ticket)}
                        >
                          <td className='tbody__tr__td w-2/12'>
                            <div className='w-full flex flex-wrap items-center gap-3 justify-center'>
                              <button className='badge badge-blue select-text'>{ticket.id} #</button>
                            </div>
                          </td>
                          <td className='tbody__tr__td w-2/12'>
                            <div className="td__wrapper">
                              <span className={`text-xs ${ticket.status === 'open' ? 'text-green-500'
                                : ticket.status === 'closed' ? 'text-red-500'
                                  : ''
                                }`}>
                                {
                                  ticket.status === 'open' ? 'پاسخ داده شده'
                                    : ticket.status === 'closed' ? 'بسته شده'
                                      : 'در انتظار پاسخ'
                                }
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
            </>
          )
        }

        <UserMassageSection
          showMassageSection={showMassageSection}
          closeMassageSection={closeMassageSection}
          setTickets={setTickets}
          ticket={selectTicket}
          bottomRef={bottomRef}
        />
      </div>

      <Toaster />
    </>
  )
}

export default UserTickets