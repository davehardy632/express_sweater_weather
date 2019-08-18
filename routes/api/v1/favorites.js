var express = require("express");
var router = express.Router();
var User = require('../../../models').User;
var Location = require('../../../models').Location;
const fetch = require("node-fetch");
const axios = require('axios');

router.post("/", function(req, res, next) {
  key = req.body.api_key;
  location = req.body.location;
  User.findAll({ where: { apiKey: key }})
  .then(function(user) {
    Location.create({
      name: location,
      UserId: user[0]["dataValues"]["id"]
    })
    .then(function(location) {
      responseObj = {};
      responseObj["message"] = `${location["dataValues"]["name"]} has been added to your favorites`
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(JSON.stringify(responseObj));
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
})

////// function return favorite location
function arrayOfFavoriteLocations(key) {
  User.findAll({ where: { apiKey: key }})
  .then(function(user) {
    id = user[0]["dataValues"]["id"];
    Location.findAll({ where: { UserId: id }})
    .then(function(locations) {
      locationArray = [];
      for (const key of Object.keys(locations)) {
        locationArray.push(locations[key]["dataValues"]["name"]);
      }
      return locationArray;
    })
  })
  .catch(error => {
    res.setHeader("Content-Type", "application/json");
    res.status(500).send({ error });
  });
}


let fetchDataFromApi = async (location) => {
  let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCa4n7lyqXASgTqCmCcV6EbTUhWM65tgZo&address=${location}`);
  let results = await response.json();
  return results["results"][0]["geometry"]["location"];
}

let fetchForecastFromApi = async (coordinateObj) => {
  let response = await fetch(`https://api.darksky.net/forecast/a0afd4046e86e2555d0a937cdac811fe/${coordinateObj["lat"]},${coordinateObj["lng"]}?exclude==minutely,hourly,daily,alerts,flags`);
  let results = await response.json();
  return results;
}

let favoriteLocations = async (key) => {
  let response = await User.findAll({ where: { apiKey: key }})
  let userId = response[0]["dataValues"]["id"]
  let locations = await Location.findAll({ where: { UserId: userId }}).then(returnValue => {
    return returnValue
  })
  .catch(error => {
    res.setHeader("Content-Type", "application/json");
    res.status(500).send({ error });
  });
  // let allLocations = []
  return locations;
}

let accrueLatLong = async (array) => {
  let coordinates= [];
  for (let i = 0; i < array.length; i++) {
    let res = await fetchDataFromApi(array[i]);
    coordinates.push(res);
  }
  return coordinates;
}

let accrueForecasts = async (array) => {
  let forecastArray = [];
  for (let i = 0; i < array.length; i++) {
    let res = await fetchForecastFromApi(array[i]);
    forecastArray.push(res);
  }
  return forecastArray;
}


router.get("/", async function(req, res, next) {
  userKey = req.body.api_key

  if (userKey == undefined) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify("Api key invalid."));
  } else {
    favorites = await favoriteLocations(userKey)
    favoriteArray = [];
    favorites.forEach(function(element) {
      favoriteArray.push(element["dataValues"]["name"]);
    })

    latLongArray = await accrueLatLong(favoriteArray)
    favoriteForecasts = await accrueForecasts(latLongArray)


    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(favoriteForecasts));
  }
})

let authenticateUser = async (apiKey) => {
  let user = await User.findAll({ where: { apiKey: apiKey }})
  return user;
}

let associatedLocation = async (id, locationName) => {
  let locations = await Location.findAll({ where: {UserId: id, name: locationName}})
  return locations;
}


router.delete("/", async function(req, res, next) {
  let userKey = req.body.api_key
  let location = req.body.location

  authenticated = await authenticateUser(userKey)
  let userId = authenticated[0]["dataValues"]["id"]

  if ((authenticated[0]["dataValues"]["apiKey"]) == userKey) {

    location = await associatedLocation(userId, location)
    locationId = location[0]["dataValues"]["id"]

    Location.destroy({where: {
                      id: locationId
                    }})
                    .then(deletedLocation => {
                      res.setHeader("Content-Type", "application/json");
                      res.status(204).send()
                    })
                    .catch(error => {
                      res.setHeader("Content-Type", "application/json");
                      res.status(500).send({ error });
                    });

  } else {
    console.log("Problems")
  }
})



// router.get("/", function(req, res, next) {
//   key = req.body.api_key
//
//   User.findAll({ where: { apiKey: key }})
//   .then(function(user) {
//     id = user[0]["dataValues"]["id"];
//     Location.findAll({ where: { UserId: id }})
//     .then(function(locations) {
//       locationArray = [];
//       for (const key of Object.keys(locations)) {
//         locationArray.push(locations[key]["dataValues"]["name"]);
//       }
//       return locationArray;
//     })
//
//
//     .then(function(favorites) {
//       coordinateArray = [];
//
//       favorites.forEach(function(element) {
//       coordinateArray.push(fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCa4n7lyqXASgTqCmCcV6EbTUhWM65tgZo&address=${element}`)
//         .then(function(response) {
//           return response.json();
//         })
//         .then(function(myJson) {
//           element = myJson["results"][0]["geometry"]["location"]
//           return element;
//         })
//         // above is the end of the first then statement
//         .catch(error => {
//           res.setHeader("Content-Type", "application/json");
//           res.status(500).send({ error });
//         })
//         // above is supposedly the end of the catch statement for the fetch async function
//
//         // above is semicolon for the return value in the forEach block
//         )
//         // above is the end of the puush function to the end of the array
//       });
//
//       return coordinateArray;
//       // above is ending to array iteration function
//     })


//     .then(async function(myJson) {
//
//       // const infoArray = [];
//       // console.log(myJson)
//       promise1 = myJson[0]
//       promise2 = myJson[1]
//
//       promise1.then(function(value) {
//         value;
//       });
//
//       const result = await promise1
//       const result2 = await promise2
//
//       console.log(result)
//       console.log(result2)
//
//       myJson.forEach(function(element) {
//         infoArray.push(fetch(`https://api.darksky.net/forecast/a0afd4046e86e2555d0a937cdac811fe/${element["lat"]},${element["lng"]}?exclude==minutely,hourly,daily,alerts,flags`)
//         .then(function(response) {
//           return response.json();
//         })
//         .then(function(myJson) {
//           // console.log(myJson)
//           // return myJson["results"][0]["geometry"]["location"];
//         })
//         .catch(error => {
//           res.setHeader("Content-Type", "application/json");
//           res.status(500).send({ error });
//         })
//         // end of fetch then block
//         )
//         // push statement paren above
//       });
//       return infoArray;
//
//     })
//     // next then statement
//   })
// })

module.exports = router;
