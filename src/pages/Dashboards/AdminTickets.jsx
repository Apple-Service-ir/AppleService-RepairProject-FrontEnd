import React, { useContext, useState } from 'react'
import { useEffect } from 'react'

import AuthContext from '../../context/AuthContext'
import { get } from '../../utility'
import PortalModal from '../../components/PortalModal/PortalModal'
import MessageSection from '../../components/MessageSection/MessageSection'
import { useRef } from 'react'

function AdminTickets() {
  const authContext = useContext(AuthContext)

  const [tickets, setTickets] = useState([])
  const [modal, setModal] = useState({ shwo: false, ticket: {} })
  const bottomRef = useRef()

  useEffect(() => {
    get(`/tickets/all?admin=true&token=${authContext.userToken}`)
      .then(response => {
        setTickets(response.data.tickets)
      })
  }, [])

  return (
    <>
      <div className='w-full flex flex-col items-center'>
        <h1 className='w-full text-right text-xl sansbold'>لیست تیکت ها</h1>
        {
          tickets.length > 0 && (
            <div className='w-full overflow-x-auto rounded-xl mt-1'>
              <table className='table'>
                <thead className='thead mt-1'>
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
                        onClick={() => {
                          document.documentElement.requestFullscreen()
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
          )
        }
      </div>

      {
        modal.show && (
          <PortalModal
            closeHandler={() => {
              document.exitFullscreen()
              setModal({ show: false, ticket: {} })
            }}
          >
            <div className="w-96 h-[80vh] relative">
              <MessageSection
                setTickets={setTickets}
                ticket={modal.ticket}
                bottomRef={bottomRef}
              >
              </MessageSection>
            </div>
          </PortalModal>
        )
      }
    </>
  )
}

export default AdminTickets