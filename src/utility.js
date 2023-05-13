import axios from "axios"

const mainUrl = 'http://192.168.1.123:3000'

// get
const get = async url => {
  const req = await axios.get(`${mainUrl}${url}`)
  console.log(req);
  return req
}

// ---

export {
  mainUrl,
  get
}