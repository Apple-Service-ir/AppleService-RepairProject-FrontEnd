import axios from "axios"
import { baseApiURL } from "../../config.json"

const connection = axios.create({
  baseURL: baseApiURL,
})

const get = async (url, token) => {
  return await connection({
    method: 'get',
    url,
    ...(token && { headers: { auth: `Bearer ${token}` } })
  })
}

const post = async (url, token, data) => {
  return await connection({
    method: 'post',
    url,
    ...(token && { headers: { auth: `Bearer ${token}` } }),
    data
  })
}

const postForm = async (url, token, data) => {
  return await connection({
    method: 'post',
    url,
    ...(token && { headers: { auth: `Bearer ${token}` } }),
    data
  })
}

export {
  get,
  post,
  postForm
}