







router.get("/", function(req, res, next) {
  let locationValue = req.url.split("=")[1];
  if (User.findAll({ where: { apiKey: req.body.api_key }})
    .then(user => { return true })
    .catch(error => console.error({ error }))) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCa4n7lyqXASgTqCmCcV6EbTUhWM65tgZo&address=${locationValue}`)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        return myJson["results"][0]["geometry"]["location"];
      })
      .then(function(latLongObject) {
        latitude = latLongObject["lat"];
        longitude = latLongObject["lng"];
        fetch(`https://api.darksky.net/forecast/a0afd4046e86e2555d0a937cdac811fe/39.7392358,-104.990251?latitude=${latitude}&longitude=-${longitude}&exclude=minutely,alerts,flags`)
        .then(function(response) {
          return response.json();
        })
        .then(function(myJson) {
          forecastObj = {};

          forecastObj["location"] = locationValue;
          forecastObj[Object.keys(myJson)[3]] = myJson["currently"];

          forecastObj["hourly"] = myJson["hourly"];
          forecastObj["hourly"]["data"] = myJson["hourly"]["data"].slice(0, 8);

          forecastObj["daily"] = myJson["daily"]
          forecastObj["daily"]["data"] = myJson["daily"]["data"].slice(0, 7)

          res.setHeader("Content-Type", "application/json");
          res.status(200).send(JSON.stringify(forecastObj));
        })
        .catch(error => {
          res.setHeader("Content-Type", "application/json");
          res.status(500).send({ error });
        });
      })
      .catch(error => {
        res.setHeader("Content-Type", "application/json");
        res.status(500).send({ error });
      });

    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(400).send(JSON.stringify("Invalid request parameters."));
    }
});




















// const fetch = require("node-fetch");
//
// class GoogleGeocodingApiService {
//   constructor() {
//       this.latLong = {};
//   }
//
//   returnLocation (location) {
//     fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCa4n7lyqXASgTqCmCcV6EbTUhWM65tgZo&address=${location}`)
//     .then(response => response.json())
//     .catch(error => console.error({ error }));
//   }
// }
//
//
//
// var latLongService = new GoogleGeocodingApiService();
//
// module.exports = latLongService;

// "https://api.darksky.net/forecast/a0afd4046e86e2555d0a937cdac811fe/39.7392358,-104.990251?latitude=39.7392358&longitude=-104.990251&exclude=minutely,alerts,flags"

// .then(response => response.json())
// .then(hedgehogs => appendHedgehogs(hedgehogs))
// .catch(error => console.error({ error }));
