var express = require("express");
var router = express.Router();
var User = require('../../../models').User;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uuidAPIKey = require('uuid-apikey');

router.post("/", function(req, res, next) {
  let hash = bcrypt.hashSync(req.body.password, saltRounds);
  let newKey = uuidAPIKey.create()["apiKey"];
  if (bcrypt.compareSync(req.body.password_confirmation, hash)) {
      User.create({
        email: req.body.email,
        password: hash,
        apiKey: newKey
      })
      .then(user => {
        apiKeyResponse = {"api_key": user["apiKey"]}
        res.setHeader("Content-Type", "application/json");
        res.status(201).send(JSON.stringify(apiKeyResponse));
      })
      .catch(error => {
        res.setHeader("Content-Type", "application/json");
        res.status(500).send({ error });
      });
  } else {
    res.setHeader("Content-Type", "application/json");
    res.status(400).send(JSON.stringify("Password confirmation does not match"));
  }
});

module.exports = router;
