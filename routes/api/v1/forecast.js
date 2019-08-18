var express = require("express");
var router = express.Router();
var User = require('../../../models').User;
const fetch = require("node-fetch");
// var latLongService = require('../../../services/GoogleGeocodingApiService');

let authenticateUser = async (apiKey) => {
  let user = await User.findAll({ where: { apiKey: apiKey }})
  return user;
}

let fetchLatLong = async (location) => {
  let data = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCa4n7lyqXASgTqCmCcV6EbTUhWM65tgZo&address=${location}`);
  let results = await data.json();
  return results["results"][0]["geometry"]["location"];
}

let fetchForecast = async (latLongObj) => {
  let response = await fetch(`https://api.darksky.net/forecast/a0afd4046e86e2555d0a937cdac811fe/${latLongObj["lat"]},${latLongObj["lng"]}?exclude==minutely,alerts,flags`);
  let results = await response.json();
  return results;
}


router.get("/", async function(req, res, next) {
  let locationValue = req.url.split("=")[1];
  let key = req.body.api_key

  authenticated = await authenticateUser(key)

    if ((authenticated[0]["dataValues"]["apiKey"]) == key && locationValue != undefined) {

      latLong = await fetchLatLong(locationValue)
      forecast = await fetchForecast(latLong)

      forecastObj = {};

      forecastObj["location"] = locationValue;
      forecastObj[Object.keys(forecast)[3]] = forecast["currently"];

      forecastObj["hourly"] = forecast["hourly"];
      forecastObj["hourly"]["data"] = forecast["hourly"]["data"].slice(0, 8);

      forecastObj["daily"] = forecast["daily"]
      forecastObj["daily"]["data"] = forecast["daily"]["data"].slice(0, 7)

      res.setHeader("Content-Type", "application/json");
      res.status(200).send(JSON.stringify(forecastObj));
    } else {
      console.log("not working")
    }
})



// router.get("/", function(req, res, next) {
//   let locationValue = req.url.split("=")[1];
//   if (User.findAll({ where: { apiKey: req.body.api_key }})
//     .then(user => { return true })
//     .catch(error => console.error({ error }))) {
//       fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCa4n7lyqXASgTqCmCcV6EbTUhWM65tgZo&address=${locationValue}`)
//       .then(function(response) {
//         return response.json();
//       })
//       .then(function(myJson) {
//         return myJson["results"][0]["geometry"]["location"];
//       })
//       .then(function(latLongObject) {
//         latitude = latLongObject["lat"];
//         longitude = latLongObject["lng"];
//         fetch(`https://api.darksky.net/forecast/a0afd4046e86e2555d0a937cdac811fe/39.7392358,-104.990251?latitude=${latitude}&longitude=-${longitude}&exclude=minutely,alerts,flags`)
//         .then(function(response) {
//           return response.json();
//         })
//         .then(function(myJson) {
//           forecastObj = {};
//
//           forecastObj["location"] = locationValue;
//           forecastObj[Object.keys(myJson)[3]] = myJson["currently"];
//
//           forecastObj["hourly"] = myJson["hourly"];
//           forecastObj["hourly"]["data"] = myJson["hourly"]["data"].slice(0, 8);
//
//           forecastObj["daily"] = myJson["daily"]
//           forecastObj["daily"]["data"] = myJson["daily"]["data"].slice(0, 7)
//
//           res.setHeader("Content-Type", "application/json");
//           res.status(200).send(JSON.stringify(forecastObj));
//         })
//         .catch(error => {
//           res.setHeader("Content-Type", "application/json");
//           res.status(500).send({ error });
//         });
//       })
//       .catch(error => {
//         res.setHeader("Content-Type", "application/json");
//         res.status(500).send({ error });
//       });
//
//     } else {
//       res.setHeader("Content-Type", "application/json");
//       res.status(400).send(JSON.stringify("Invalid request parameters."));
//     }
// });

module.exports = router;

// res.setHeader("Content-Type", "application/json");
// res.status(200).send(JSON.stringify(myJson));

// fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCa4n7lyqXASgTqCmCcV6EbTUhWM65tgZo&address=${locationValue}`)
// .then(response => {
//   console.log(keyParam);
//   res.setHeader("Content-Type", "application/json");
//   res.status(200).send(response.json());
//   // res.status(200).send(JSON.stringify(response.body));
// })
// .catch(error => console.error({ error }));
// }


// res.setHeader("Content-Type", "application/json");
// res.status(200).send(JSON.stringify(latLong));
// res.setHeader("Content-Type", "application/json");
// res.status(500).send({error})
