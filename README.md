# express_sweater_weather

<h2>Introduction</h2>

Express sweater weather is an Javascript/ Express Api that allows a User to register, Log in, retrieve an api key, and get forecast data by city. A user can also add cities to their favorites and get a forecast response that contains the current forecast of all their favorite cities.

<h2>Set Up</h2>

<h4>Packages</h4>

<ul>
  <h4>Testing<h4>
  <li>Testing: $ npm install jest -g</li>
  <li>Testing: npm install babel-jest supertest shelljs -D</li>
</ul>

To set up, fork and clone the repository
In the command line, run the following commands:

  > npx sequelize db:create
  > npx sequelize db:migrate 
  > npx sequelize db:seed:all
  
<h2>To test</h2>

To run the test suite, run the command:
  > npm test

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

<h4>This should return an API key that can be used in future calls.
To login and retrieve this api key, send the app the following request</h4>

<h3>To login with the Application</h3>

POST /api/v1/sessions
Content-Type: application/json
Accept: application/json

{
  "email": "my_email@example.com",
  "password": "password"
}

<h4>This will return the original Api key returned to make Api calls.</h4>

<h3>To query the application about forecast info for a city, send the following request to the application</h3>

GET /api/v1/forecast?location=denver,co
Content-Type: application/json
Accept: application/json

body:
{
  "api_key": "jgn983hy48thw9begh98h4539h4"
}

<h4>This will return a formatted forecast response with the current weather for a city, the next eight hours, and the next 7 days.</h4>

<h3>To save a location to your favorites, send the following request.</h3>

POST /api/v1/favorites
Content-Type: application/json
Accept: application/json

body:

{
  "location": "Denver, CO",
  "api_key": "jgn983hy48thw9begh98h4539h4"
}

<h4>This will add a location to your favorites which can be used in the next api call.</h4>

<h3>To return the current forecasts of all your favorite cities, send the following request</h3>

GET /api/v1/favorites
Content-Type: application/json
Accept: application/json

body:

{
  "api_key": "jgn983hy48thw9begh98h4539h4"
}

<h4>This will return the current forecast of all your favorite cities that were saved in the post request prior.</h4>

<h3>Finally, to delete a location from your favorites, send a request in the following format.</h3>

DELETE /api/v1/favorites
Content-Type: application/json
Accept: application/json

body:

{
  "location": "Denver, CO",
  "api_key": "jgn983hy48thw9begh98h4539h4"
}

<h4>This will delete the city from your favorites, and will no longer show up when you send a get request to favorites.</h4>


<h2>Tech Stack Used:</h2>

> This Api was built in node using the Express framework for Javascript. Node 10.16.2, Express 4.16.4
> It uses a Postgres Database, Postgres 11.1
> Tested in Jest

<h2>To Contribute:</h2>

> Feel free to fork the application and make any changes you like. You can then submit a PR with specific details of the changes and description of the features implemented.

<h2>Core Contributor:</h2>

> Created by @davehardy632 https://github.com/davehardy632


