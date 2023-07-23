import { createContext } from "react";

const DataContext = createContext({
  cities: [],
  addCityHandler: () => { },
  removeCityHandler: () => { },
  updateCityHandler: () => { },
})

export default DataContext