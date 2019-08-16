var express = require("express");
var router = express.Router();
var User = require('../../../models').User;
const fetch = require("node-fetch");

router.post("/", function(req, res, next) {
  key = req.body.api_key;
  location = req.body.location;

})

module.exports = router;
