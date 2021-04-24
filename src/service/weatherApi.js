import axios from 'axios'

//! Actual API is not accessible because of CORS issues

// eslint-disable-next-line no-undef
const API_ENDPOINT = process.env.PUBLIC_URL + '/data'
const API_CONFIG_ENDPOINT = `${API_ENDPOINT}/forecastconfig.json`
const API_CITIES_ENDPOINT = `${API_ENDPOINT}/cities.json`
const API_AREA_FORECAST_ENDPOINT = `${API_ENDPOINT}/forecast.json`

export async function getForecastConfigSubstitutes() {
  try {
    const res = await axios.get(API_CONFIG_ENDPOINT)
    return res.data
  } catch (e) {
    console.error('Could not fetch forecast config', e)
  }
}

export async function getCities(domain) {
  try {
    const apiCitiesUrl = `${API_CITIES_ENDPOINT}?domain=${domain})`
    const res = await axios.get(apiCitiesUrl)
    return Object.values(res.data)
  } catch (e) {
    console.error('Could not fetch cities for domain ' + domain, e)
  }
}

export async function getAreaForecast(area) {
  try {
    const apiAreaForecastUrl = `${API_AREA_FORECAST_ENDPOINT}?area_id=${area})`
    const res = await axios.get(apiAreaForecastUrl)
    return res.data.data?.[area.id]
  } catch (e) {
    console.error('Could not fetch forecast for area ' + area, e)
  }
}
