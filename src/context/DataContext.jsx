import { createContext } from "react";

const DataContext = createContext({
  cities: [],
  setCitiesHandler: () => { }
})

export default DataContext