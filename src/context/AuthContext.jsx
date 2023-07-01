import { createContext } from "react";

const AuthContext = createContext({
  userToken: null,
  isLogin: false,
  userInfo: null,
  setUserInfoHandler: () => { },
  login: () => { },
  logOut: () => { },
})

export default AuthContext