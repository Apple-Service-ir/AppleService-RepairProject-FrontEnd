import axios from "axios"

const mainUrl = 'http://192.168.1.159:3000'

// get
const get = async url => (await axios.get(`${mainUrl}${url}`))

// post
const post = async (url, body) => (await axios.post(`${mainUrl}${url}`, body))

// getMe
const getMe = async () => {
  if (!document.cookie.includes("token")) return null
  const userCookie = document.cookie.split('=')[1]
  const response = await get(`/informations/get?token=${userCookie}`)
  return response.data
}
// ---

export {
  mainUrl,
  get,
  post,
  getMe
}