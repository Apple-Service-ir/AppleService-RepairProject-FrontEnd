import React, { useContext, useState, useRef, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'

import { get, post } from '../../utility'
import AuthContext from '../../context/AuthContext'
import PortalModal from '../../components/PortalModal/PortalModal'
import Alert from '../../components/Alert/Alert'
import MessageSection from '../../components/MessageSection/MessageSection'

function AdminTickets() {
  const authContext = useContext(AuthContext)

  const [tickets, setTickets] = useState([])
  const [modal, setModal] = useState({ shwo: false, ticket: {} })

  const bottomRef = useRef()

  useEffect(() => {
    document.title = "تیکت ها - داشبورد مدیریت اپل سرویس"
  }, [])

  useEffect(() => {
    authContext.userToken && get(`/tickets/all?admin=true&token=${authContext.userToken}`)
      .then(response => {
        setTickets(response.data.tickets)
      })
  }, [authContext])

  const closeTicket = (event, ticket) => {
    event.stopPropagation()

    if (ticket.status !== 'closed') {
      post('/tickets/close', {
        token: authContext.userToken,
        ticketId: ticket.id
      })
        .then(() => {
          setTickets(prev => {
            const filteredTickets = prev.map(item => {
              if (item.id === ticket.id) {
                item.status = 'closed'
                return item
              }
              return item
            })

            return filteredTickets
          })
        })
        .catch(errorr => toast.error(errorr.response.data.err))
    }
  }

  return (
    <>
      <div className='w-full flex flex-col items-center show-fade'>
        <h1 className='w-full text-right text-xl sansbold'>لیست تیکت ها</h1>
        {
          tickets.length > 0 ? (
            <div className='w-full overflow-x-auto rounded-xl mt-1'>
              <table className='table'>
                <thead className='thead mt-1'>
                  <tr className='thead__tr'>
                    <th className='thead__tr__th w-2/12'>کد تیکت</th>
                    <th className='thead__tr__th w-2/12'>وضعیت</th>
                    <th className='thead__tr__th w-4/12'>موضوع تیکت</th>
                    <th className='thead__tr__th w-2/12'>تاریخ</th>
                    <th className='thead__tr__th w-2/12'>بستن تیکت</th>
                  </tr>
                </thead>
                <tbody className='tbody'>
                  {
                    tickets.map(ticket => (
                      <tr
                        key={ticket.id}
                        className={`tbody__tr cursor-pointer
                          ${ticket.status === 'closed' && 'opacity-50 hover:bg-white'}`}
                        onClick={() => {
                          ticket.status === 'closed' && toast.error('این تیکت بسته شده است', {
                            position: "bottom-center"
                          })
                          setModal({ show: true, ticket })
                        }}
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
                        <td className='tbody__tr__td w-4/12 text-sm'>{ticket.subject}</td>
                        <td className='tbody__tr__td w-2/12 text-sm'>
                          {new Date(ticket.createdAt).toLocaleDateString('fa-IR')}
                        </td>
                        <td
                          className='tbody__tr__td w-1/12 group'
                          onClick={event => closeTicket(event, ticket)}
                        >
                          <div className="td__wrapper justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                              className={`stroke-red-500 w-5 h-5
                              ${ticket.status !== 'closed' && 'group-hover:-translate-y-1'}`}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          ) : (
            <Alert
              theme={'danger'}
              title={'تیکت ای ثبت نشده است.'}
              icon={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
            />
          )
        }
      </div >

      {
        modal.show && (
          <PortalModal
            closeHandler={() => setModal({ show: false, ticket: {} })}
          >
            <div className="w-96 h-[80vh] relative">
              <MessageSection
                setTickets={setTickets}
                currentTicket={modal.ticket}
                setCurrentTicket={ticket => {
                  setModal(prev => ({ ...prev, ticket }))
                }}
                bottomRef={bottomRef}
              >
              </MessageSection>
            </div>
          </PortalModal>
        )
      }

      < Toaster />
    </>
  )
}

export default AdminTickets