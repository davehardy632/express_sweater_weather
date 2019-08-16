var express = require("express");
var router = express.Router();
var User = require('../../../models').User;
var Location = require('../../../models').Location;
const fetch = require("node-fetch");

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

module.exports = router;
