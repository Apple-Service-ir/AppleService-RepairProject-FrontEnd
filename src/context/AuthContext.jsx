import { createContext } from "react";

const AuthContext = createContext({
  userToken: null,
  isLogin: false,
  userInfo: null,
  setUserInfoHandler: () => { },
  login: () => { },
  logOut: () => { },
  // progress loading
  progressIsLoading: false,
  setProgressIsLoadingHandler: () => { }
})

export default AuthContext