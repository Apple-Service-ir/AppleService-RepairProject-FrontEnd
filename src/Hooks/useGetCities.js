import { useEffect, useState } from 'react'
import { get } from '../utility'

function useGetCities() {
  const [allCities, setAllCities] = useState([])
  const [defaultCity, setDefaultCity] = useState({})

  useEffect(() => {
    const userCity = JSON.parse(localStorage.getItem('e-service-userInfo')).city

    get('/list/cities')
      .then(response => {
        const firstCity = response.data.find(city => city.name === userCity)
        const otherCities = response.data.filter(city => city.name !== userCity)

        setAllCities([firstCity, ...otherCities])
        setDefaultCity(firstCity)
      })
  }, [])

  return [defaultCity, allCities]
}

export default useGetCities