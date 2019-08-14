var express = require("express");
var router = express.Router();
var User = require('../../../models').User;

router.post("/", function(req, res, next) {
  
  User.create({
          email: req.body.email,
          password: req.body.password,
          password_confirmation: req.body.password_confirmation
    })
    .then(user => {
      res.setHeader("Content-Type", "application/json");
      res.status(201).send(JSON.stringify(user));
    })
    .catch(error => {
      res.setHeader("Content-Type", "application/json");
      res.status(500).send({ error });
    });
});

module.exports = router;
