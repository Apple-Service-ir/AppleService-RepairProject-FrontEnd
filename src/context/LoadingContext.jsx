import { createContext } from "react";

const LoadingContext = createContext({
  progressIsLoading: false,
  setProgressIsLoadingHandler: () => { }
})

export default LoadingContext