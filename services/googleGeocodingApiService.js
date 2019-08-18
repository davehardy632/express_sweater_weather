//
//
//
//
//
//
//
//
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
//
//
//
//
// favorites.forEach(function(element) {
//   // console.log(element);
// coordinateObj.push(fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCa4n7lyqXASgTqCmCcV6EbTUhWM65tgZo&address=${element}`)
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     // console.log(myJson["results"][0]["geometry"]["location"]["lat"])
//     // console.log(myJson["results"][0]["geometry"]["location"]["lng"])
//     return myJson["results"][0]["geometry"]["location"]
//   })
//   // above is the end of the first then statement
//   .catch(error => {
//     res.setHeader("Content-Type", "application/json");
//     res.status(500).send({ error });
//   })
//   // above is supposedly the end of the catch statement for the fetch async function
//
//   // above is semicolon for the return value in the forEach block
//   )
//   // above is the end of the puush function to the end of the array
// });
//
//
//
//
//
//
// function arrayOfFavoriteLocations(key) {
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
//   })
//   .catch(error => {
//     res.setHeader("Content-Type", "application/json");
//     res.status(500).send({ error });
//   });
// }
//
// function returnLatLong(element) {
//   fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCa4n7lyqXASgTqCmCcV6EbTUhWM65tgZo&address=${element}`)
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(myJson) {
//     element = myJson["results"][0]["geometry"]["location"]
//     return element;
//   })
//   .catch(error => {
//     res.setHeader("Content-Type", "application/json");
//     res.status(500).send({ error });
//   });
// }

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


//////// forecast.js api call
router.get("/", function(req, res, next) {
  let locationValue = req.url.split("=")[1];
    User.findAll({ where: { apiKey: req.body.api_key }})
    .then(function(user) {
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
        fetch(`https://api.darksky.net/forecast/a0afd4046e86e2555d0a937cdac811fe/${latitude},${longitude}?exclude==minutely,hourly,daily,alerts,flags`)
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
      })
    .catch(error => {
      res.setHeader("Content-Type", "application/json");
      res.status(500).send({ error });
  });
})
