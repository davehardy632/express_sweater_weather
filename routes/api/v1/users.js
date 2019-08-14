var express = require("express");
var router = express.Router();
var User = require('../../../models').User;
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post("/", function(req, res, next) {
  let hash = bcrypt.hashSync(req.body.password, saltRounds);
  // if bcrypt.compareSync(req.body.password_confirmation, hash);
  console.log(bcrypt.compareSync(req.body.password_confirmation, hash));

  User.create({
          email: req.body.email,
          password: hash,
          apiKey: "12345"
    })
    .then(game => {
      res.setHeader("Content-Type", "application/json");
      res.status(201).send(JSON.stringify(game));
    })
    .catch(error => {
      res.setHeader("Content-Type", "application/json");
      res.status(500).send({ error });
    });
});

module.exports = router;
