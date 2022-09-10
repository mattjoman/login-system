/********* REQUIRED MODULES *********/
require('dotenv').config();
const mysql = require('mysql2'); // Important: use mysql2, not mysql
const cpm = require('mysql-connection-pool-manager');
const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');

/********* MY MODULES *********/
const { hashPassword, comparePassword } = require('../helpers/password');
const { queryDatabase } = require('../helpers/dbQuery');
const { authenticateToken, generateAccessToken } = require('../helpers/token');









/********* /user/ ROUTES *********/



router.get('/', (request, response) => { response.send('You are at /api/user/') });
router.post('/createAccount/', createAccount);
router.post('/login/', login);
router.get('/doWhileLoggedIn/', authenticateToken, doWhileLoggedIn);









/********* Database connection pool. *********/



const dbCred = {
  host:     "database",
  user:     "root",
  password: "test123",
  database: "website"
};
const pool = mysql.createPool({
  ...dbCred,
  connectionLimit: 10
});










/********* FUNCTIONS *********/



/*
 * Middlewear is run before this function to verify the user's JWT.
 */
function doWhileLoggedIn(request, response) {
  console.log("Your JWT has been verified, now do something while logged in!");
  response.send("Your JWT has been verified, now do something while logged in!");
}



/*
 * Create new user account.
 */
async function createAccount(request, response) {
  const input = request.body;

  // query database to check if a user with this email already exists
  // move this to separate function 'userExists()'?
  const inputArray = [
    input.name,
    input.email,
    hashPassword(input.password),
  ];
  let dbResult1;
  const query1 = 'SELECT * FROM users WHERE email=?';
  try {
    dbResult1 = await queryDatabase(pool, query1, [input.email]);
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
  if (dbResult1.length > 0) {
    console.log('Email is not unique');
    response.status(403).send('Email is not unique');
  }

  // query database to insert new user
  let dbResult2;
  const query2 = 'INSERT INTO users VALUES (?, ?, ?, Null)';
  try {
    dbResult2 = await queryDatabase(pool, query2, inputArray);
  } catch (err) {
    console.log(err);
    response.status(500).send();
  }
  console.log(dbResult2);
  console.log("Secret: " + process.env.ACCESS_TOKEN_SECRET);
  response.status(201).send("Successfully created new account: " + process.env.ACCESS_TOKEN_SECRET);
}



/*
 * User login.
 */
async function login(request, response) {
  const password = request.body.password;
  const email = request.body.email;

  const query1 = "SELECT * FROM users WHERE email=?";
  let dbResult1;

  // try to query the database
  try {
    dbResult1 = await queryDatabase(pool, query1, [email]);
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }

  // test for bad conditions
  if (!comparePassword(password, dbResult1[0].password)) {
    response.status(403).send('Incorrect password');
  }
  if (dbResult1.length == 0) {
    response.status(403).send('No users with that email');
  } else if (dbResult1.length > 1) {
    response.status(403).send('Multiple users with that email');
  }

  // create user object, generate token and send to the client
  const user = {
    _email: email,
  };
  const token = generateAccessToken(user);
  console.log(token);
  response.status(201).json({accessToken: token});
}









/********* EXPORTS *********/

module.exports = router;
