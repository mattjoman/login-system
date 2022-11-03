/********* REQUIRED MODULES *********/
require('dotenv').config();
//const cpm = require('mysql-connection-pool-manager');
const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');

/********* MY MODULES *********/
const { hashPassword, comparePassword } = require('../helpers/password');
const { dbPool, queryDatabase } = require('../helpers/dbQuery');
const { authenticateToken, generateAccessToken } = require('../helpers/token');

/********* /admin/ ROUTES *********/
router.get('/', (request, response) => { response.send('You are at /api/admin/') });
router.post('/createAccount/', createAccount);
router.post('/login/', login);
router.get('/doWhileLoggedIn/', authenticateToken, doWhileLoggedIn);




/********* FUNCTIONS *********/

/*
 * Middlewear is run before this function to verify the user's JWT.
 */
function doWhileLoggedIn(request, response) {
  console.log("Your JWT has been verified!");
  user = request.user;
  if (user === undefined) {
    response.status(500).send("Send your JWT!");
    return;
  }
  if (user._admin != 1) {
    response.status(403).send("You are not logged in as an admin!");
    return;
  }
  response.status(201).json(request.user);
  return;
}



/*
 * Create new user account.
 */
async function createAccount(request, response) {
  //const input = request.body;

  // check if the data is provided
  const name = request.body.name;
  const email = request.body.email;
  const password = request.body.password;
  if (name === undefined || email === undefined || password === undefined) {
    response.status(500).send("Give name, email and password");
    return;
  }

  // query database to check if a user with this email already exists
  // move this to separate function 'userExists()'?
  let dbResult1;
  const query1 = 'SELECT * FROM users WHERE email=?';
  try {
    dbResult1 = await queryDatabase(dbPool, query1, [email]);
  } catch (err) {
    console.log(err);
    response.status(500).send();
    return;
  }
  if (dbResult1.length > 0) {
    console.log('Email is not unique');
    response.status(403).send('Email is not unique');
    return;
  }

  // query database to insert new user
  let inputArray = [
    name,
    email,
    hashPassword(password)
  ];
  let dbResult2;
  const query2 = "INSERT INTO users VALUES (?, ?, ?, 1, Null)"; // create admin account, not admin
  try {
    dbResult2 = await queryDatabase(dbPool, query2, inputArray);
  } catch (err) {
    console.log(err);
    response.status(500).send();
    return;
  }
  console.log(dbResult2);
  console.log("Secret: " + process.env.ACCESS_TOKEN_SECRET);
  response.status(201).send("Successfully created new admin account: " + process.env.ACCESS_TOKEN_SECRET);
  return;
}



/*
 * User login.
 */
async function login(request, response) {

  // check if information is provided
  const password = request.body.password;
  const email = request.body.email;
  if (email === undefined || password === undefined) {
    response.status(500).send("Give your email and password!");
    return;
  }

  const query1 = "SELECT * FROM users WHERE email=?";
  let dbResult1;
  // try to query the database
  try {
    dbResult1 = await queryDatabase(dbPool, query1, [email]);
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
    return;
  }

  // test for bad conditions
  if (dbResult1.length == 0) {
    response.status(403).send('No users with that email');
    return;
  } else if (dbResult1.length > 1) {
    response.status(403).send('Multiple users with that email');
    return;
  }
  if (!comparePassword(password, dbResult1[0].password)) {
    response.status(403).send('Incorrect password');
    return;
  }
  if (dbResult1[0].admin != 1) {
    response.status(403).send("You do not have an admin account!");
    return;
  }

  // create user object, generate token and send to the client
  const user = {
    _email: email,
    _admin: 1 // the user is an admin
  };
  const token = generateAccessToken(user);
  console.log(token);
  response.status(201).json({accessToken: token});
  return;
}









/********* EXPORTS *********/

module.exports = router;
