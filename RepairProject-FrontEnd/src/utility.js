import axios from "axios"

const mainUrl = 'http://192.168.1.159:3000'

// get
const get = async url => (await axios.get(`${mainUrl}${url}`))

const post = async (url, body) => (await axios.post(`${mainUrl}${url}`, body))

// ---

export {
  mainUrl,
  get,
  post
}