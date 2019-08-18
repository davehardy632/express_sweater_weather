var express = require("express");
var router = express.Router();
var User = require('../../../models').User;
const fetch = require("node-fetch");
const keys = require("dotenv")

let authenticateUser = async (apiKey) => {
  let user = await User.findAll({ where: { apiKey: apiKey }})
  return user;
}

let fetchLatLong = async (location) => {
  let data = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GEOCODE_API_KEY}&address=${location}`);
  let results = await data.json();
  return results["results"][0]["geometry"]["location"];
}

let fetchForecast = async (latLongObj) => {
  let response = await fetch(`https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/${latLongObj["lat"]},${latLongObj["lng"]}?exclude==minutely,alerts,flags`);
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

module.exports = router;
