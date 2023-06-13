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

export {
  mainUrl,
  get,
  post,
  postForm
}