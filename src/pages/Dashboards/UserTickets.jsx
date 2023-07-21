import React, { useRef, useState, useContext, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast'

import { get, post } from '../../utils/connection'
import AuthContext from '../../context/AuthContext'
import LoadingContext from '../../context/LoadingContext'
import PortalModal from '../../components/PortalModal/PortalModal'
import Alert from '../../components/Alert/Alert'
import MessageSection from '../../components/MessageSection/MessageSection'
import SubmitBtn from '../../components/SubmitBtn/SubmitBtn'

function UserTickets() {
  const authContext = useContext(AuthContext)
  const loadingContext = useContext(LoadingContext)

  const [tickets, setTickets] = useState([])
  const [modal, setModal] = useState({ show: false, ticket: {} })
  const [ticketForm, setTicketForm] = useState({
    subject: { value: '', validation: false },
    text: { value: '', validation: false }
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [closeTicketLoading, setCloseTicketLoading] = useState(false)

  const bottomRef = useRef()

  useEffect(() => {
    if (authContext.userToken) {
      document.title = "تیکت ها - داشبورد اپل سرویس"
      get('/tickets/all', authContext.userToken)
        .then(response => {
          setTickets(response.data.tickets)
        })
        .finally(() => loadingContext.setProgressIsLoadingHandler(false))
    }
  }, [authContext.userToken])

  const submitTicketHandler = async event => {
    setSubmitLoading(true)
    event.preventDefault()

    for (const field in ticketForm)
      if (!ticketForm[field].validation) {
        setSubmitLoading(false)
        return toast.error('لطفا فیلد هارا به درستی پر کنید!')
      }

    const requestBody = {
      subject: ticketForm.subject.value,
      text: ticketForm.text.value
    }
    await post('/tickets/new', authContext.userToken, requestBody)
      .then(response => {
        setTickets(response.data.tickets)
        setTicketForm({
          subject: { value: '', validation: false },
          text: { value: '', validation: false }
        })
        toast.success('تیکت با موفقیت ثبت شد!')
      }).catch((err) => {
        toast.error(err.response.data.error)
      })

    setSubmitLoading(false)
  }

  const closeTicketHandler = async () => {
    setCloseTicketLoading(true)

    const requestBody = {
      id: modal.ticket.id
    }
    await post("/tickets/close", authContext.userToken, requestBody)
      .then(() => {
        setTickets(prev => {
          const filteredTickets = prev.map(item => {
            if (item.id === modal.ticket.id) item.status = 'closed'
            return item
          })

          return filteredTickets
        })
        setModal({ show: false, ticket: {} })
        toast.success("تیکت با موفقیت بسته شد.")
      }).catch((e) => {
        toast.error(e.response.data.err)
      })

    setCloseTicketLoading(false)
  }

  return (
    <>
      <div className='w-full flex flex-col justify-center items-center gap-3 relative  show-fade'>
        <form className="w-full flex flex-col justify-center items-center gap-3 p-3">
          <div className='w-full bg-input'>
            <input
              className='input'
              type="text"
              placeholder='عنوان تیکت'
              value={ticketForm.subject.value}
              onChange={event => {
                setTicketForm(prev => ({
                  ...prev,
                  subject: {
                    value: event.target.value,
                    validation: event.target.value.length >= 3
                  }
                }))
              }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-input">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
          </div>
          <div className='w-full bg-textarea'>
            <textarea
              className='textarea'
              placeholder='متن خود را وارد کنید'
              value={ticketForm.text.value}
              onChange={event => {
                setTicketForm(prev => ({
                  ...prev,
                  text: {
                    value: event.target.value,
                    validation: event.target.value.length >= 3
                  }
                }))
              }}
            >
            </textarea>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="svg-textarea">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </div>
          <div className="w-full">
            <SubmitBtn
              customClass={'w-1/2 sm:w-1/3'}
              isLoading={submitLoading}
              clickHandler={submitTicketHandler}
            >
              ثبت تیکت
            </SubmitBtn>
          </div>
        </form>

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
              <div className="w-full overflow-x-auto rounded-xl">
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
                          className={`tbody__tr cursor-pointer
                            ${ticket.status === 'closed' && 'opacity-50'}`}
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
      </div>

      {
        modal.show && (
          <PortalModal
            closeHandler={() => setModal({ show: false, ticket: {} })}
          >
            <div className="relative w-full h-[75vh]
              sm:w-96 sm:h-[80vh]">
              <MessageSection
                setTickets={setTickets}
                currentTicket={modal.ticket}
                setCurrentTicket={ticket => {
                  setModal(prev => ({ ...prev, ticket }))
                }}
                bottomRef={bottomRef}
                closeTicketHandler={closeTicketHandler}
                closeTicketLoading={closeTicketLoading}
              >
              </MessageSection>
            </div>
          </PortalModal>
        )
      }

      <Toaster />
    </>
  )
}

export default UserTickets