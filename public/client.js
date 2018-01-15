//global vars, need to refactor
//let map
let geolat = 33;
let geolong = -77;
//Gather location from user's browser
function initGeoLoc() {
  console.log('Init Geo Loc');
  let getGeolocation = function(options) {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };
  let geo_options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 15000
  };

  getGeolocation(geo_options)
    .then(position => {
      console.log('handle location being available');
      console.log({
        lat: position.coords.latitude,
        long: position.coords.longitude
      });
      geolat = position.coords.latitude;
      geolong = position.coords.longitude;

      initGoogleMap(position.coords.latitude, position.coords.longitude);
      //initialize G Map with coords
    })
    .catch(err => {
      //handle the location being unavailable
      console.log('user denied promp or it did not work');
      console.error(err.message);
    });
}

//Set up all event handlers here
document.getElementById('go').addEventListener('click', initGeoLoc);
document.getElementById('enter').addEventListener('click', searchZip);

var map;

function initGoogleMap(lat, long) {
  console.log(`${lat}, ${long}`);

  let jsCustomMap = document.createElement('script');
  jsCustomMap.type = 'text/javascript';
  jsCustomMap.src =
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyD0QDQIBb8duJ3tRNRn6eM5JfVntCG4bCw&libraries=places&callback=initMap';

  document.getElementsByTagName('head')[0].appendChild(jsCustomMap);
}
function initMap(geolat, geolong) {
  console.log(`${geolat}, ${geolong}`);
  //let centerLocation = new google.maps.LatLng(38.9044, -77.0321)
  let centerLocation = new google.maps.LatLng(geolat, geolong);
  map = new google.maps.Map(document.getElementById('map'), {
    center: centerLocation,
    zoom: 15
  });

  let service = new google.maps.places.PlacesService(map);
  service.nearbySearch(
    {
      location: centerLocation,
      radius: 500,
      type: ['cafe'] //FIXME:Can I filter this even deeper?
    },
    processResults
  );
}

function processResults(results, status, pagination) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    return;
  } else {
    createMarkers(results);
    //pagination logic goes here, skipping for now
  }
}

function createMarkers(places) {
  let bounds = new google.maps.LatLngBounds();
  let placesList = document.getElementById('places');

  for (let i = 0, place; (place = places[i]); i++) {
    //TODO: need a marker for user's location too, maybe custom with a tooltip
    let marker = new google.maps.Marker({
      map: map,
      // icon: image, TODO: Custom icons should be here
      title: place.name,
      animation: google.maps.Animation.DROP,
      position: place.geometry.location
    });

    bounds.extend(place.geometry.location);
  }
  map.fitBounds(bounds);
}

//zip searching workflow
function searchZip() {
  //perform zip validation first
  let zip = document.getElementById('zip').value;
  if (zip.length !== 5 || !/[0-9]/.test(zip)) {
    console.log('validation failed, returning');
    return;
  }
  console.log('seach zip function fired');
  console.log(`zip value (string) is this: ${zip}`);
  //Fire Google Maps API search
  //TODO: Need to conver zip to long/lat using Googles Geocoding API
}
