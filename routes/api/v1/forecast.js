var express = require("express");
var router = express.Router();
var User = require('../../../models').User;
const fetch = require("node-fetch");
// var latLongService = require('../../../services/GoogleGeocodingApiService');

router.get("/", function(req, res, next) {
  let locationValue = req.url.split("=")[1];
  // var latLong = latLongService.returnLocation(locationValue)
  if (User.findAll({ where: { apiKey: req.body.api_key }
    }).then(user => { return true })
    .catch(error => console.error({ error }))) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCa4n7lyqXASgTqCmCcV6EbTUhWM65tgZo&address=${locationValue}`)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        console.log(JSON.stringify(myJson));
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(myJson));
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

module.exports = router;

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
