import React from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'

function parseDates(forecastParam) {
  return Object.keys(forecastParam)
    .filter((d) => d !== 'description')
    .map((d) => moment(d, 'YYYYMMDDhhmm').format('DD MMM HH:mm'))
}

function parseTemperatureValues(forecastParam) {
  const entries = { ...forecastParam }
  delete entries.description
  return Object.values(entries)
    .filter((d) => d !== 'description')
    .map((t) => parseFloat(t['C']))
}

function parseHumidityValues(forecastParam) {
  const entries = { ...forecastParam }
  delete entries.description
  return Object.values(entries)
    .filter((d) => d !== 'description')
    .map((hu) => parseFloat(hu['%']))
}

function getWeatherCode(areaForecastData, dateTimeEntry) {
  return areaForecastData.params.ww?.[dateTimeEntry]?.code
}

function getWeatherDescription(forecastConfig, weatherCode) {
  return forecastConfig.substitutes.ww?.[weatherCode]
}

//TODO display weather icons corresponding to weather description, but where to find these icons?
export default function WeatherForecastChart({ forecastData, config }) {
  const options = {
    chart: {
      zoomType: 'xy'
    },
    title: {
      text: `Weather forecast for ${forecastData.areainfo.forecast_area.name} (next 3 days)`
    },
    subtitle: {
      text: 'Source: MFI'
    },
    xAxis: {
      categories: parseDates(forecastData.params.t)
    },
    yAxis: [
      {
        title: {
          text: 'Temperature'
        },
        labels: {
          formatter: function () {
            return this.value + '°C'
          }
        }
      },
      {
        title: {
          text: 'Humidity (%)'
        },
        labels: {
          formatter: function () {
            return this.value + '%'
          }
        },
        opposite: true,
        min: 0,
        max: 100
      }
    ],
    tooltip: {
      shared: true,
      formatter: function (tooltip) {
        let tooltipContent = tooltip.defaultFormatter.call(this, tooltip)
        const dateTimeEntry = moment(this.x, 'DD MMM HH:mm').format('YYYYMMDDhhmm')
        const weatherCode = getWeatherCode(forecastData, dateTimeEntry)
        if (weatherCode) {
          const weatherDescription = getWeatherDescription(config, weatherCode)
          if (weatherDescription) {
            tooltipContent.push(`<b>${weatherDescription}</b>`)
          }
        }
        return tooltipContent
      }
    },
    series: [
      {
        type: 'column',
        name: 'Humidity',
        data: parseHumidityValues(forecastData.params.hu),
        tooltip: {
          valueSuffix: '%'
        },
        yAxis: 1
      },
      {
        type: 'spline',
        name: 'Temperature',
        data: parseTemperatureValues(forecastData.params.t),
        tooltip: {
          valueSuffix: '°C'
        }
      }
    ]
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />
}

WeatherForecastChart.propTypes = {
  forecastData: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired
}
