var shell = require("shelljs")
var request = require("supertest")
var app = require("./app")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uuidAPIKey = require('uuid-apikey');
const express = require("express");
var router = express.Router();
var User = require('./models').User;

// describe("api", () => {
//   beforeAll(() => {
//     shell.exec('npx sequelize db:create')
//   });
//   beforeEach(() => {
//     shell.exec('npx sequelize db:migrate')
//     shell.exec('npx sequelize db:seed:all')
//   });
//   afterEach(() => {
//     shell.exec('npx sequelize db:migrate:undo:all')
//     shell.exec('npx sequelize db:drop')
//   });
describe('api', () => {
  beforeAll(() => {
    shell.exec('npx sequelize db:create')
  });
  beforeEach(() => {
      shell.exec('npx sequelize db:migrate')
      shell.exec('npx sequelize db:seed:all')
    });
  afterEach(() => {
    shell.exec('npx sequelize db:migrate:undo:all')
  });


  describe ("test the root path", () => {
    test("should return a 202 status", () => {
      return request(app).get("/").then(response => {
        expect(response.statusCode).toBe(200);
      })
    })
  })

  describe ("test the account creation path", () => {
    test("should return a 201 status", () => {
      return request(app)
      .post("/api/v1/users")
      .send({
        "email": "my_email@example.com",
        "password": "password",
        "password_confirmation": "password"
      })
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(Object.keys(response.body)).toContain("api_key");
      })
    })
  })

  describe ("test the account login path", async () => {
    test("should return a 201 status and an api key", async () => {
      let hash = bcrypt.hashSync("password", saltRounds);
      let newKey = uuidAPIKey.create()["apiKey"];
      let user = await User.create({
        email: "my_email@example.com",
        password: "password",
        apiKey: newKey
      })
      return user;
      return request(app)
      .post("/api/v1/sessions")
      .send({
        "email": "my_email@example.com",
        "password": "password",
      })
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(Object.keys(response.body)).toContain("api_key");
      })
    })
  })


  describe ("test the return forecast path", async () => {
    test("should return a 201 status", async () => {
      let hash = bcrypt.hashSync("password", saltRounds);
      let newKey = uuidAPIKey.create()["apiKey"];
      let user = await User.create({
        email: "my_email2@example.com",
        password: "password",
        apiKey: newKey
      })
      return user;
      return request(app)
      .get("/api/v1/forecast?location=denver,co")
      .send({
        "api_key": newKey
        })
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body)).toContain("location");
        expect(Object.keys(response.body)).toContain("currently");
        expect(Object.keys(response.body)).toContain("hourly");
        expect(Object.keys(response.body)).toContain("daily");
        expect(Object.keys(response.body["currently"])).toContain("summary");
        expect(Object.keys(response.body["currently"])).toContain("icon");
        expect(Object.keys(response.body["currently"])).toContain("precipIntensity");
        expect(Object.keys(response.body["currently"])).toContain("precipProbability");
        expect(Object.keys(response.body["currently"])).toContain("temperature");
        expect(Object.keys(response.body["currently"])).toContain("humidity");
        expect(Object.keys(response.body["currently"])).toContain("pressure");
        expect(Object.keys(response.body["currently"])).toContain("windSpeed");
        expect(Object.keys(response.body["currently"])).toContain("windGust");
        expect(Object.keys(response.body["currently"])).toContain("windBearing");
        expect(Object.keys(response.body["currently"])).toContain("cloudCover");
        expect(Object.keys(response.body["currently"])).toContain("visibility");
        expect(Object.keys(response.body["hourly"])).toContain("summary");
        expect(Object.keys(response.body["hourly"])).toContain("icon");
        expect(Object.keys(response.body["hourly"])).toContain("data");
        expect(Object.keys(response.body["daily"])).toContain("summary");
        expect(Object.keys(response.body["daily"])).toContain("icon");
        expect(Object.keys(response.body["daily"])).toContain("data");
        expect(response.body["daily"]["daily"].length).toBe(7);
        expect(response.body["hourly"]["data"].length).toBe(8);
      })
    })
  })

  describe ("test creating a favorite path", async () => {
    test("should return a 200 status and a message indicating the change", async () => {
      let hash = bcrypt.hashSync("password", saltRounds);
      let newKey = uuidAPIKey.create()["apiKey"];
      let user = await User.create({
        email: "my_email@example.com",
        password: "password",
        apiKey: newKey
      })
      return user;
      return request(app)
      .post("/api/v1/favorites")
      .send({
        "location": "Denver, CO",
        "api_key": newKey
      })
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body)).toContain({
          "message": "Denver, CO has been added to your favorites",
        });
      })
    })
  })

  describe ("test listing favorite locations", async () => {
    test("should return a 200 status and a message indicating the change", async () => {
      let hash = bcrypt.hashSync("password", saltRounds);
      let newKey = uuidAPIKey.create()["apiKey"];
      let user = await User.create({
        email: "my_email@example.com",
        password: "password",
        apiKey: newKey
      })

      let location1 = await Location.create({
        name: "Denver, CO",
        UserId: user[0]["dataValues"]["id"]
      })

      let location2 = await Location.create({
        name: "Boston, MA",
        UserId: user[0]["dataValues"]["id"]
      })
      return location1;
      return location2;
      
      return user;
      return request(app)
      .get("/api/v1/favorites")
      .send({
        "api_key": newKey
      })
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(Object.keys(response.body)).toContain({
          "message": "Denver, CO has been added to your favorites",
        });
      })
    })
  })
})
