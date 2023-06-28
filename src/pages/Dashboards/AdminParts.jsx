import React, { useEffect, useState, useContext } from 'react'
import { toast, Toaster } from 'react-hot-toast'

import AuthContext from '../../context/AuthContext'
import { get, post } from '../../utility'
import Alert from '../../components/Alert/Alert'
import PortalModal from '../../components/PortalModal/PortalModal'
import SubmitBtn from '../../components/SubmitBtn/SubmitBtn'
import DeleteIconLoader from '../../components/DeleteIconLoader/DeleteIconLoader'

function AdminParts() {
  const authContext = useContext(AuthContext)

  const [showPartsForm, setShowPartsForm] = useState(false)
  const [partName, setPartName] = useState({ value: '', validation: false })
  const [parts, setParts] = useState([])
  const [modal, setModal] = useState({ show: false, part: {} })
  const [editPartName, setEditPartName] = useState({ value: '', validation: false })
  const [createPartLoading, setCreatePartLoading] = useState(false)
  const [deletePartLoading, setDeletePartLoading] = useState({ isLoading: false, id: null })
  const [editPartLoading, setEditPartLoading] = useState(false)

  useEffect(() => {
    document.title = "مدیریت قطعات - داشبورد مدیریت اپل سرویس"
    authContext.setProgressIsLoadingHandler(true)
    get('/list/parts')
      .then(response => setParts(response.data))
      .finally(() => authContext.setProgressIsLoadingHandler(false))
  }, [])

  const removePartHandler = async partId => {
    await post('/admins/parts/delete', {
      token: authContext.userToken,
      id: partId
    })
      .then(() => {
        setParts(prev => {
          return prev.filter(part => part.id !== partId)
        })
        toast.success('قطعه با موفقیت حذف شد')
      })
      .catch(error => toast.error(error.response.data.err))

    setDeletePartLoading({ isLoading: false, id: null })
  }

  const partNameValidatorHandler = name => {
    const englishWords = /^[a-zA-Z]+$/
    const persianWords = /^[\u0600-\u06FF\s]+$/;

    if (!name.includes("-")) {
      toast.error('نام قطعه باید دارای اسم فارسی و انگلیسی باشد. همچنین اسم را با " - " جداسازی نمایید')
      return { status: false, name }
    }

    if (!partName.value.includes(" - ") && partName.validation) {
      name = partName.value.replace("-", " - ")
    }

    if (!editPartName.value.includes(" - ") && editPartName.validation) {
      name = editPartName.value.replace("-", " - ")
    }

    if (!englishWords.test(name.split(" - ")[0][0].toLowerCase())
      || !persianWords.test(name.split(" - ")[1][0])) {
      toast.error("ابتدا اسم قطعه به انگلیسی و سپس به فارسی وارد نمایید")
      return { status: false, name }
    }

    return { status: true, name }
  }

  const addPartHandler = async event => {
    event.preventDefault()

    if (!partName.validation) return toast.error('لطفا فیلد را کامل کنید')

    const partNameValidator = partNameValidatorHandler(partName.value)
    if (partNameValidator.status) {
      setCreatePartLoading(true)
      await post('/admins/parts/create', {
        token: authContext.userToken,
        name: partNameValidator.name
      })
        .then(response => {
          setParts(prev => [response.data.part, ...prev])
          setPartName({ value: '', validation: false })
          toast.success('قطعه با موفقیت اضافه شد')
        })
        .catch(error => toast.error(error.response.data.err))

      setCreatePartLoading(false)
    }
  }

  const editPartNameHandler = async event => {
    event.preventDefault()

    if (!editPartName.validation) return toast.error('لطفا فیلد را کامل کنید')

    const partNameValidator = partNameValidatorHandler(editPartName.value)
    if (partNameValidator.status) {
      setEditPartLoading(true)

      await post('/admins/parts/edit', {
        token: authContext.userToken,
        id: modal.part.id,
        data: { name: partNameValidator.name },
      })
        .then(() => {
          setParts(prev => {
            const newParts = prev.map(part => {
              if (part.id === modal.part.id) part.name = partNameValidator.name
              return part
            })
            return newParts
          })
          setEditPartName({ value: '', validation: false })
          toast.success('قطعه با موفقیت ویرایش شد')
        })
        .catch(error => toast.error(error.response.data.err))

      setModal({ show: false, part: {} })
      setEditPartLoading(false)
    }
  }

  return (
    <>
      <div className='w-full flex flex-col items-center show-fade'>
        <div className="w-full">
          <button
            className='btn btn-blue'
            onClick={() => setShowPartsForm(prev => !prev)}
          >
            {showPartsForm ? 'بستن' : 'ساخت قطعه جدید'}
            {
              showPartsForm ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>

              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              )
            }
          </button>
        </div>
        {
          showPartsForm && (
            <form className='w-full flex justify-center items-center gap-3 mt-3 show-fade'>
              <div className='w-full bg-input
                sm:w-1/2'>
                <input
                  className='input'
                  type="text"
                  placeholder='نام قطعه'
                  value={partName.value}
                  onChange={event => {
                    setPartName({
                      value: event.target.value,
                      validation: event.target.value.length > 1
                    })
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                  className="svg-input">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                </svg>
              </div>
              <SubmitBtn
                customClass={'w-full sm:w-1/2'}
                isLoading={createPartLoading}
                clickHandler={addPartHandler}
              >
                اضافه کردن
              </SubmitBtn>
            </form>
          )
        }

        <h1 className='w-full text-right text-xl sansbold mt-6'>لیست قطعات</h1>
        {
          parts.length > 0 ? (
            <div className="w-full overflow-x-auto rounded-xl mt-3">
              <table className='table'>
                <thead className='thead'>
                  <tr className='thead__tr'>
                    <th className='thead__tr__th w-2/12'>ID</th>
                    <th className='thead__tr__th w-8/12'>نام قطعه</th>
                    <th className='thead__tr__th w-1/12'>ویرایش</th>
                    <th className='thead__tr__th w-1/12'>حذف</th>
                  </tr>
                </thead>
                <tbody className='tbody'>
                  {
                    parts.map(part => (
                      <tr
                        key={part.id}
                        className='tbody__tr'
                      >
                        <td className='tbody__tr__td w-2/12'>
                          <div className='w-full flex flex-wrap items-center gap-3 justify-center'>
                            <button className='badge badge-blue select-text'>{part.id} #</button>
                          </div>
                        </td>
                        <td className='tbody__tr__td w-8/12 text-sm'>{part.name}</td>
                        <td
                          className='tbody__tr__td w-1/12 group cursor-pointer'
                          onClick={() => {
                            setModal({ show: true, part })
                            setEditPartName({ value: part.name, validation: true })
                          }}
                        >
                          <div className="td__wrapper justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-blue-500 w-5 h-5
                            group-hover:-translate-y-1">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </div>
                        </td>
                        <td
                          className='tbody__tr__td w-1/12 group cursor-pointer'
                          onClick={() => {
                            setDeletePartLoading({ isLoading: true, id: part.id })
                            removePartHandler(part.id)
                          }}
                        >
                          <div className="td__wrapper justify-center">
                            <DeleteIconLoader
                              customClass={'group-hover:-translate-y-1'}
                              isLoading={deletePartLoading.isLoading && (deletePartLoading.id === part.id)}
                            />
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
              title={'قطعه ای ثبت نشده است.'}
              icon={(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
            />
          )
        }
      </div>

      {
        modal.show && (
          <PortalModal
            closeHandler={() => setModal({ show: false, part: {} })}
          >
            <form className="bg-white w-96 flex flex-col justify-center items-center gap-3 p-3 rounded-xl">
              <div className='w-full bg-input'>
                <input
                  className='input'
                  type="text"
                  placeholder='نام جدید قطعه'
                  value={editPartName.value}
                  onChange={event => {
                    setEditPartName({
                      value: event.target.value,
                      validation: event.target.value.length > 1
                    })
                  }}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                  className="svg-input">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                </svg>
              </div>
              <SubmitBtn
                customClass={'w-full'}
                clickHandler={editPartNameHandler}
                isLoading={editPartLoading}
              >
                ثبت تغییر
              </SubmitBtn>
            </form>
          </PortalModal>
        )
      }

      <Toaster />
    </>
  )
}

export default AdminParts