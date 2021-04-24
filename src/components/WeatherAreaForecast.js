import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import WeatherForecastChart from './WeatherForecastChart'
import { getAreaForecast } from '../service/weatherApi'

export default function WeatherAreaForecast({ city, config }) {
  if (!city) {
    return null
  }

  const [cityForecastData, setCityForecastData] = useState(null)

  useEffect(() => {
    getAreaForecast(city).then((forecastData) => setCityForecastData(forecastData))
  }, [city])

  return <div>{cityForecastData && <WeatherForecastChart forecastData={cityForecastData} config={config} />}</div>
}

WeatherAreaForecast.propTypes = {
  city: PropTypes.object,
  config: PropTypes.object.isRequired
}
