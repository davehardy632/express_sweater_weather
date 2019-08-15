var express = require("express");
var router = express.Router();
var User = require('../../../models').User;

router.get("/", function(req, res, next) {
  let locationValue = req.url.split("=")[1];
  let keyParam = req.url.split("=")[0].substr(2);
  let stringArgument = keyParam + " " + locationValue
  User.findAll({
    where: {
      apiKey: req.body.api_key
    }
  })
  .then(user => {
    
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(user));
  })
  .catch(error => {
    res.setHeader("Content-Type", "application/json");
    res.status(500).send({error})
  });
});

module.exports = router;
