import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Map from 'ol/Map'
import View from 'ol/View'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { defaults as defaultControls } from 'ol/control'
import ScaleLine from 'ol/control/ScaleLine'
import { fromLonLat } from 'ol/proj'
import { Fill, Stroke, Circle, Style } from 'ol/style'
import 'ol/ol.css'

const defaultCityStyle = new Style({
  image: new Circle({
    fill: new Fill({
      color: 'rgba(255,255,255,0.3)'
    }),
    stroke: new Stroke({
      color: 'blue',
      width: 2
    }),
    radius: 5
  })
})

const selectedCityStyle = new Style({
  image: new Circle({
    fill: new Fill({
      color: 'rgba(255,255,255,0.3)'
    }),
    stroke: new Stroke({
      color: 'red',
      width: 2
    }),
    radius: 5
  })
})

const highlightedCityStyle = new Style({
  image: new Circle({
    fill: new Fill({
      color: 'rgba(255,255,255,0.3)'
    }),
    stroke: new Stroke({
      color: 'orange',
      width: 2
    }),
    radius: 5
  })
})

export default function WeatherMap({ cities, onSelectCity }) {
  const mapRef = useRef()
  const [map, setMap] = useState(null)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [highlightedFeatures, setHighlightedFeatures] = useState([])

  // add map with OSM layer
  useEffect(() => {
    const map = new Map({
      target: mapRef.current,
      controls: defaultControls().extend([new ScaleLine()]),
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        zoom: 2,
        center: [0, 0]
      })
    })
    setMap(map)

    return () => {
      // cleanup effect: remove old map from dom
      map.setTarget(null)
    }
  }, [])

  // add cities layer
  useEffect(() => {
    if (!map || !cities?.length) {
      return
    }
    const citiesFeatures = cities.map((city) => {
      return new Feature({
        geometry: new Point(fromLonLat([city.longitude, city.latitude])),
        id: city.id,
        description: city.description
      })
    })

    const citiesLayer = new VectorLayer({
      name: 'cities',
      source: new VectorSource({
        features: citiesFeatures
      }),
      style: defaultCityStyle
    })

    map.addLayer(citiesLayer)

    const citiesExtent = citiesLayer.getSource().getExtent()
    map.getView().fit(citiesExtent)

    return () => {
      // cleanup effect by removing previously added layer
      if (map && citiesLayer) {
        map.removeLayer(citiesLayer)
      }
    }
  }, [map, cities])

  // handle city selection
  useEffect(() => {
    if (!map) {
      return
    }

    const onMapClick = (e) => {
      if (selectedFeature) {
        selectedFeature.setStyle(defaultCityStyle)
      }
      const features = map.getFeaturesAtPixel(e.pixel, (layer) => {
        return layer.get('name') === 'cities'
      })
      if (features.length) {
        const feature = features[0]
        feature.setStyle(selectedCityStyle)
        setSelectedFeature(feature)
        const city = feature.getProperties()
        onSelectCity(city)
      } else {
        setSelectedFeature(null)
        onSelectCity(null)
      }
    }

    map.on('click', onMapClick)

    return () => {
      // cleanup effect: remove event handler
      map.un('click', onMapClick)
    }
  }, [map, selectedFeature, onSelectCity])

  // handle city highlighting
  useEffect(() => {
    if (!map) {
      return
    }

    const onMapPointerMove = (e) => {
      highlightedFeatures.forEach((feature) => {
        if (feature !== selectedFeature) {
          feature.setStyle(defaultCityStyle)
        }
      })
      const features = map.getFeaturesAtPixel(e.pixel, (layer) => {
        return layer.get('name') === 'cities'
      })

      features.forEach((feature) => {
        if (feature !== selectedFeature) {
          feature.setStyle(highlightedCityStyle)
        }
      })
      setHighlightedFeatures(features)
    }

    map.on('pointermove', onMapPointerMove)

    return () => {
      // cleanup effect: remove event handler
      map.un('pointermove', onMapPointerMove)
    }
  }, [map, highlightedFeatures, selectedFeature])

  return <div id="map" ref={mapRef} style={{ height: '350px', width: '100%' }} />
}

WeatherMap.propTypes = {
  cities: PropTypes.array.isRequired,
  onSelectCity: PropTypes.func.isRequired
}
