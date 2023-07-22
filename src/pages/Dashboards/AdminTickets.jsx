import React, { useContext, useState, useRef, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'

import { get, post } from '../../utils/connection'
import AuthContext from '../../context/AuthContext'
import LoadingContext from '../../context/LoadingContext'
import PortalModal from '../../components/PortalModal/PortalModal'
import Alert from '../../components/Alert/Alert'
import MessageSection from '../../components/MessageSection/MessageSection'
import CloseIconLoader from '../../components/CloseIconLoader/CloseIconLoader'

function AdminTickets() {
  const authContext = useContext(AuthContext)
  const loadingContext = useContext(LoadingContext)

  const [tickets, setTickets] = useState([])
  const [modal, setModal] = useState({ shwo: false, ticket: {} })
  const [closeTicketIsLoading, setCloseTicketIsLoading] = useState({ isLoading: false, id: null })

  const bottomRef = useRef()

  useEffect(() => {
    if (authContext.userToken) {
      document.title = "تیکت ها - داشبورد مدیریت اپل سرویس"
      get('/tickets/all?admin=true', authContext.userToken)
        .then(response => {
          setTickets(response.data.tickets)
        })
        .finally(() => loadingContext.setProgressIsLoadingHandler(false))
    }
  }, [authContext.userToken])

  const closeTicket = async (event, ticket) => {
    event.stopPropagation()

    if (ticket.status !== 'closed') {
      const requestBody = {
        id: ticket.id
      }
      await post('/tickets/close', authContext.userToken, requestBody)
        .then(() => {
          setTickets(prev => {
            const filteredTickets = prev.map(item => {
              if (item.id === ticket.id) item.status = 'closed'
              return item
            })

            return filteredTickets
          })
          toast.success('تیکت با موفقیت بسته شد')
        })
        .catch(errorr => toast.error(errorr.response.data.err))

      setCloseTicketIsLoading({ isLoading: false, id: null })
    }
  }

  return (
    <>
      <div className='w-full flex flex-col items-center show-fade'>
        {
          tickets.length > 0 ? (
            <div className='w-full mt-3'>
              <h1 className='w-full text-right text-xl sansbold'>
                لیست تیکت ها
              </h1>
              <div className='w-full overflow-x-auto rounded-xl mt-3'>
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
                            onClick={event => {
                              setCloseTicketIsLoading({ isLoading: true, id: ticket.id })
                              closeTicket(event, ticket)
                            }}
                          >
                            <div className="td__wrapper justify-center">
                              <CloseIconLoader
                                customClass={ticket.status !== 'closed' && 'group-hover:-translate-y-1'}
                                isLoading={closeTicketIsLoading.isLoading && (closeTicketIsLoading.id === ticket.id)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <Alert
              theme={'danger'}
              title={'تیکتی ثبت نشده است'}
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