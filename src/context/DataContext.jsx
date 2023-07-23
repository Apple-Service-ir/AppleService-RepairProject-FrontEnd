import { createContext } from "react";

const DataContext = createContext({
  cities: [],
  addCityHandler: () => { },
  removeCityHandler: () => { },
})

export default DataContext