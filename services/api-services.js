const fetch = require("node-fetch");
var express = require("express");
const keys = require("dotenv")


let fetchDataFromApi = async (location) => {
  let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GEOCODE_API_KEY}&address=${location}`);
  let results = await response.json();
  return results["results"][0]["geometry"]["location"];
}

module.exports = fetchDataFromApi;
