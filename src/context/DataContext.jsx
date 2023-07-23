import { createContext } from "react";

const DataContext = createContext({
  cities: [],
  setCities: () => { }
})

export default DataContext