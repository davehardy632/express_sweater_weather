var express = require("express");
var router = express.Router();
var User = require('../../../models').User;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uuidAPIKey = require('uuid-apikey');

router.post("/", function(req, res, next) {
  User.findAll({
    where: {
      email: req.body.email,
    }
  })
  .then(user => {
    hashedPassword = user['0']['dataValues']['password']
    if (bcrypt.compareSync(req.body.password, hashedPassword)) {
      apiKeyResponse = {"api_key": user['0']['dataValues']['apiKey']}
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(JSON.stringify(apiKeyResponse));
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(400).send(JSON.stringify("Invalid credentials."));
    }
  })
  .catch(error => {
    res.setHeader("Content-Type", "application/json");
    res.status(500).send({ error })
  });
});

module.exports = router;
