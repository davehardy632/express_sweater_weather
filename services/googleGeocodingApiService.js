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

// "https://api.darksky.net/forecast/a0afd4046e86e2555d0a937cdac811fe/39.7392358,-104.990251?latitude=39.7392358&longitude=-104.990251&exclude=minutely,alerts,flags"

// .then(response => response.json())
// .then(hedgehogs => appendHedgehogs(hedgehogs))
// .catch(error => console.error({ error }));
