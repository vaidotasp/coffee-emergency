//Gather location from user's browser
let getGeolocation = function(options) {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

let geo_options = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 15000
}

//commented out for debug options-it works
getGeolocation(geo_options)
  .then(position => {
    console.log({
      lat: position.coords.latitude,
      long: position.coords.longitude
    })
  })
  .catch(err => {
    //handle the location being unavailable
    console.log('user denied promp or it did not work')
    console.error(err.message)
  })

//Set up all event handlers here
document.getElementById('enter').addEventListener('click', searchZip)

function searchZip() {
  //perform zip validation first
  let zip = document.getElementById('zip').value
  if (zip.length !== 5 || !/[0-9]/.test(zip)) {
    console.log('validation failed, returning')
    return
  }
  console.log('seach zip function fired')
  console.log(`zip value (string) is this: ${zip}`)
  //Fire Google Maps API search
  initAPI(zip)
}

function initAPI(zip) {
  console.log(`init API function fired with value ${zip}`)
}

//map initialization section FIXME:prob needs refactoring, works for now
let jsCustomMap = document.createElement('script')
jsCustomMap.type = 'text/javascript'
jsCustomMap.src =
  'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0QDQIBb8duJ3tRNRn6eM5JfVntCG4bCw&libraries=places&callback=initMap'

document.getElementsByTagName('head')[0].appendChild(jsCustomMap)

let map

function initMap() {
  let centerLocation = new google.maps.LatLng(38.9044, -77.0321)

  map = new google.maps.Map(document.getElementById('map'), {
    center: centerLocation,
    zoom: 15
  })

  let service = new google.maps.places.PlacesService(map)
  service.nearbySearch(
    {
      location: centerLocation,
      radius: 500,
      type: ['cafe']
    },
    processResults
  )
}

function processResults(results, status, pagination) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    return
  } else {
    createMarkers(results)
    //pagination logic goes here, skipping for now
  }
}

function createMarkers(places) {
  let bounds = new google.maps.LatLngBounds()
  let placesList = document.getElementById('places')

  for (let i = 0, place; (place = places[i]); i++) {
    let image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    }
    //TODO: need a marker for user's location too, maybe custom with a tooltip
    let marker = new google.maps.Marker({
      map: map,
      // icon: image, TODO: Custom icons should be here
      title: place.name,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location
    })
    placesList.innerHTMl += '<li>' + place.name + '</li>'
    bounds.extend(place.geometry.location)
  }
  map.fitBounds(bounds)
}
