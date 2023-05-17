import './style.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { fromLonLat } from 'ol/proj'
// import ol from 'ol'


// set initial location
const MaineLonLat = [-70.4428, 43.5009]
let CoordWebMercator = fromLonLat(MaineLonLat)

let newCoords = []

let map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: CoordWebMercator,
    zoom: 8,
  }),
})

let coordButton = document.createElement('button')
coordButton.textContent = 'Set Map Center'
coordButton.style.position = 'relative'
coordButton.style.display = 'block'
coordButton.style.height = '40px'
coordButton.style.width = '130px'
coordButton.style.borderRadius = '20px'

coordButton.style.left = '50%'
coordButton.style.top = '0'
coordButton.style.margin = '10px'
coordButton.style.transform = 'translateX(-50%)'


coordButton.addEventListener('click', setNewMapCenterCoord)

export function setNewMapCenterCoord() {
  const lon = document.getElementById('lonInput').value
  const lat = document.getElementById('latInput').value
  const lonW = document.getElementById('lonW')
  const lonE = document.getElementById('lonE')
  const latN = document.getElementById('latN')
  const latS = document.getElementById('latS')
  let lonRose
  let latRose

  if (lonW.checked) {
    lonRose = '-'
  } else if (lonE.checked) {
    lonRose = ''
  }

  if (latN.checked) {
    latRose = ''
  } else if (latS.checked) {
    latRose = '-'
  }

  newCoords = [`${lonRose}${lon}`, `${latRose}${lat}`]

  CoordWebMercator = fromLonLat(newCoords)
  setNewMap(CoordWebMercator)
}

function setNewMap(CoordWebMercator) {
  map.getView().setCenter(CoordWebMercator)
  map.render()
}

// create coordinate box
let parentElem = document.getElementById('coord-box')
parentElem.style.width = '260px'
parentElem.style.height = '130px'
parentElem.style.position = 'absolute'
parentElem.style.zIndex = '10'
parentElem.style.backgroundColor = 'grey'
parentElem.style.borderRadius = '30px'
parentElem.style.padding = '15px'
parentElem.style.margin = '35px'
parentElem.style.right = '22px'
parentElem.appendChild(coordButton)


map.on('moveend', function () {
  var center = map.getView().getCenter()
  var lonLat = ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326')
  console.log(lonLat) // do something with the new latitude and longitude
  let newLon = lonLat[0]
  let newLat = lonLat[1]

  if (newLon < 0) {
    document.getElementById('lonW').checked = true
    document.getElementById('lonE').checked = false
    document.getElementById('lonInput').value = newLon * 1
  } else {
    document.getElementById('lonE').checked = true
    document.getElementById('lonW').checked = false
    document.getElementById('lonInput').value = newLon
  }

  if (newLat < 0) {
    document.getElementById('latS').checked = true
    document.getElementById('latN').checked = false
    document.getElementById('latInput').value = newLat * 1
  } else {
    document.getElementById('latN').checked = true
    document.getElementById('latS').checked = false
    document.getElementById('latInput').value = newLat
  }

})