import React, { useState, useEffect } from 'react'

import WeatherForecast from './components/WeatherForecast'
import './App.css'
import { getForecastConfigSubstitutes } from './service/weatherApi'

const COUNTRY = 'Nepal'

function App() {
  const [forecastConfig, setForecastConfig] = useState(null)

  useEffect(() => {
    getForecastConfigSubstitutes().then((config) => setForecastConfig(config))
  }, [])

  return (
    <div className="app">
      {forecastConfig ? (
        <WeatherForecast country={COUNTRY} config={forecastConfig} />
      ) : (
        <span>Loading weather forecast config...</span>
      )}
    </div>
  )
}

export default App
