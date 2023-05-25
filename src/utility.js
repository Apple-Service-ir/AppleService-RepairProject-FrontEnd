import axios from "axios"
import { mainUrl } from "../config.json"

// get
const get = async url => (await axios.get(`${mainUrl}${url}`))

// post
const post = async (url, body) => (await axios.post(`${mainUrl}${url}`, body))

// post formData
const postForm = async (url, formData) => {
  return await axios({
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    url: mainUrl + url,
    data: formData,
  })
}

// getMe
const getMe = async () => {
  const userToken = localStorage.getItem('e-service-token')
  if (!userToken) return null
  const response = await get(`/informations/get?token=${userToken}`)
  !response.data.ok && localStorage.removeItem('e-service-token')
  return response.data.ok ? response.data.user : null
}
// ---

export {
  mainUrl,
  get,
  post,
  postForm,
  getMe
}