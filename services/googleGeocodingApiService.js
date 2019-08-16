const fetch = require("node-fetch");

class GoogleGeocodingApiService {
  constructor() {
      this.latLong = {};
  }

  returnLocation (location) {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCa4n7lyqXASgTqCmCcV6EbTUhWM65tgZo&address=${location}`)
    .then(response => response.json())
    .catch(error => console.error({ error }));
  }
}



var latLongService = new GoogleGeocodingApiService();

module.exports = latLongService;


// .then(response => response.json())
// .then(hedgehogs => appendHedgehogs(hedgehogs))
// .catch(error => console.error({ error }));
