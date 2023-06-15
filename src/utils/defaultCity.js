function defaultCity(cities) {
  const userCity = JSON.parse(localStorage.getItem('e-service-userInfo')).city
  const defaultCity = cities.find(city => city.name === userCity)
  const otherCities = cities.filter(city => city.name !== userCity)

  return [defaultCity, [defaultCity, ...otherCities]]
}

export default defaultCity