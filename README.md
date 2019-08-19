# express_sweater_weather

<h2>Introduction</h2>

Express sweater weather is an Javascript/ Express Api that allows a User to register, Log in, retrieve an api key, and get forecast data by city. A user can also add cities to their favorites and get a forecast response that contains the current forecast of all their favorite cities.

<h2>Set Up</h2>

<h4>Packages</h4>


  $ npm install jest -g
  $ npm install babel-jest supertest shelljs -D


<h4>Environment Variables</h4>

  $ npm install dotenv

<h4>Bcrypt</h4>

  $ npm install bcrypt


To set up, fork and clone the repository
In the command line, run the following commands:

  $ npx sequelize db:create
  $ npx sequelize db:migrate 
  $ npx sequelize db:seed:all
  
<h2>To test</h2>

To run the test suite, run the command:
  $ npm test

<h2>Schema Design</h2>

<p>The database used a one to many relationship between a registered user and their favorite locations. A user can have many favorite locations.</p>

> User Table => 
> email:string,
> password:envrypted_string, 
> apiKey:random_character_string, 
> timestamps

> Location Table => 
> name:string, 
> UserId:reference_to_user_table

<h2>How to Use</h2>

<h3>To create an Account in your application, make a post request with the following info</h3>

POST /api/v1/users
Content-Type: application/json
Accept: application/json

{
  "email": "my_email@example.com",
  "password": "password"
  "password_confirmation": "password"
}

<h4>Response</h4>

status: 201
body:

{
  "api_key": "jgn983hy48thw9begh98h4539h4",
}

<h3>To login with the Application</h3>

POST /api/v1/sessions
Content-Type: application/json
Accept: application/json

{
  "email": "my_email@example.com",
  "password": "password"
}

<h4>Response</h4>

status: 200
body:

{
  "api_key": "jgn983hy48thw9begh98h4539h4",
}

<h3>To query the application about forecast info for a city, send the following request to the application</h3>

GET /api/v1/forecast?location=denver,co
Content-Type: application/json
Accept: application/json

body:
{
  "api_key": "jgn983hy48thw9begh98h4539h4"
}

<h4>Response</h4>

{
  "location": "Denver, C0",
  "currently": {
      "summary": "Overcast",
      "icon": "cloudy",
      "precipIntensity": 0,
      "precipProbability": 0,
      "temperature": 54.91,
      "humidity": 0.65,
      "pressure": 1020.51,
      "windSpeed": 11.91,
      "windGust": 23.39,
      "windBearing": 294,
      "cloudCover": 1,
      "visibility": 9.12,
    },
  "hourly": {
    "summary": "Partly cloudy throughout the day and breezy this evening.",
    "icon": "wind",
    "data": [
      {
      "time": 1555016400,
      "summary": "Overcast",
      "icon": "cloudy",
      "precipIntensity": 0,
      "precipProbability": 0,
      "temperature": 54.9,
      "humidity": 0.65,
      "pressure": 1020.8,
      "windSpeed": 11.3,
      "windGust": 22.64,
      "windBearing": 293,
      "cloudCover": 1,
      "visibility": 9.02,
      },
    ]
  },
  "daily": {
    "summary": "No precipitation throughout the week, with high temperatures bottoming out at 58°F on Monday.",
    "icon": "clear-day",
    "data": [
      {
        "time": 1554966000,
        "summary": "Partly cloudy throughout the day and breezy in the evening.",
        "icon": "wind",
        "sunriseTime": 1554990063,
        "sunsetTime": 1555036947,
        "precipIntensity": 0.0001,
        "precipIntensityMax": 0.0011,
        "precipIntensityMaxTime": 1555045200,
        "precipProbability": 0.11,
        "precipType": "rain",
        "temperatureHigh": 57.07,
        "temperatureLow": 51.47,
        "humidity": 0.66,
        "pressure": 1020.5,
        "windSpeed": 10.94,
        "windGust": 33.93,
        "cloudCover": 0.38,
        "visibility": 9.51,
        "temperatureMin": 53.49,
        "temperatureMax": 58.44,
      },
    ]
  }
}

<h3>To save a location to your favorites, send the following request.</h3>

POST /api/v1/favorites
Content-Type: application/json
Accept: application/json

body:

{
  "location": "Denver, CO",
  "api_key": "jgn983hy48thw9begh98h4539h4"
}

<h4>Response</h4>

status: 200
body:

{
  "message": "Denver, CO has been added to your favorites",
}

<h3>To return the current forecasts of all your favorite cities, send the following request</h3>

GET /api/v1/favorites
Content-Type: application/json
Accept: application/json

body:

{
  "api_key": "jgn983hy48thw9begh98h4539h4"
}

<h4>Response</h4>

status: 200
body:
[
  {
    "location": "Denver, CO",
    "current_weather": {
      "summary": "Overcast",
      "icon": "cloudy",
      "precipIntensity": 0,
      "precipProbability": 0,
      "temperature": 54.91,
      "humidity": 0.65,
      "pressure": 1020.51,
      "windSpeed": 11.91,
      "windGust": 23.39,
      "windBearing": 294,
      "cloudCover": 1,
      "visibility": 9.12,
    },
    "location": "Golden, CO",
    "current_weather": {
      "summary": "Sunny",
      "icon": "sunny",
      "precipIntensity": 0,
      "precipProbability": 0,
      "temperature": 71.00,
      "humidity": 0.50,
      "pressure": 1015.10,
      "windSpeed": 10.16,
      "windGust": 13.40,
      "windBearing": 200,
      "cloudCover": 0,
      "visibility": 8.11,
    }
  }
]

<h3>Finally, to delete a location from your favorites, send a request in the following format.</h3>

DELETE /api/v1/favorites
Content-Type: application/json
Accept: application/json

body:

{
  "location": "Denver, CO",
  "api_key": "jgn983hy48thw9begh98h4539h4"
}

<h4>Response</h4>

status: 204

<h2>Tech Stack Used:</h2>

> This Api was built in node using the Express framework for Javascript. Node 10.16.2, Express 4.16.4
> It uses a Postgres Database, Postgres 11.1
> Tested in Jest

<h2>To Contribute:</h2>

> Feel free to fork the application and make any changes you like. You can then submit a PR with specific details of the changes and description of the features implemented.

<h2>Core Contributor:</h2>

> Created by @davehardy632 https://github.com/davehardy632


