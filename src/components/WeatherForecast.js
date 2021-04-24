import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import WeatherMap from './WeatherMap'
import WeatherAreaForecast from './WeatherAreaForecast'
import { getCities } from '../service/weatherApi'

export default function WeatherForecast({ country, config }) {
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)

  useEffect(() => {
    getCities().then((cities) => setCities(cities))
  }, [country])

  const onSelectCity = (city) => {
    setSelectedCity(city)
  }

  return (
    <div>
      <h3>{country} weather map </h3>
      <WeatherMap cities={cities} onSelectCity={onSelectCity} />

      {selectedCity ? (
        <WeatherAreaForecast city={selectedCity} config={config} />
      ) : (
        <div>
          <h4>Select an area on the map</h4>
        </div>
      )}
    </div>
  )
}

WeatherForecast.propTypes = {
  country: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired
}
