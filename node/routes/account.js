/********* REQUIRED MODULES *********/
require('dotenv').config();
//const cpm = require('mysql-connection-pool-manager');
const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');

/********* MY MODULES *********/
const { hashPassword, comparePassword } = require('../helpers/password');
const { dbPool, queryDatabase } = require('../helpers/dbQuery');
const { authenticateToken, generateAccessToken, initSession, destroySession } = require('../helpers/token');

/********* /account/ ROUTES *********/
router.post('/create/', create);
router.post('/createAdmin/', createAdmin);
router.post('/delete/', deleteAccount);

/********* FUNCTIONS *********/

function create(request, response) {
  return createAccount(request, response, false);
}

function createAdmin(request, response) {
  return createAccount(request, response, true);
}

/*
 * Create new account.
 */
async function createAccount(request, response, isAdmin) {
  //const input = request.body;

  // check if the data is provided
  const name = request.body.name;
  const email = request.body.email;
  const password = request.body.password;
  if (name === undefined || email === undefined || password === undefined) {
    return response.status(400).send("Give name, email and password");
  }
  if (name === "" || email === "" || password === "") {
    return response.status(400).send("Give name, email and password");
  }

  // query database to check if a user with this email already exists
  // move this to separate function 'userExists()'?
  let dbResult1;
  const query1 = 'SELECT * FROM users WHERE email=?';
  try {
    dbResult1 = await queryDatabase(dbPool, query1, [email]);
  } catch (err) {
    console.log(err);
    return response.status(500).send('Error while checking if user exists in the database.');
  }
  if (dbResult1.length > 0) {
    return response.status(403).send('Email is not unique.');
  }

  // query database to insert new user
  let inputArray = [
    name,
    email,
    hashPassword(password)
  ];
  let query2;
  if (isAdmin) {
    query2 = "INSERT INTO users VALUES (?, ?, ?, 1, Null)"; // create normal user account, not admin
  } else {
    query2 = "INSERT INTO users VALUES (?, ?, ?, 0, Null)"; // create normal user account, not admin
  }
  let dbResult2;
  try {
    dbResult2 = await queryDatabase(dbPool, query2, inputArray);
  } catch (err) {
    console.log(err);
    return response.status(500).send('Error while adding user to the database.');
  }
  console.log("Created new user account.");
  return response.status(201).send();
}


/*
 * Delete user account.
 */
async function deleteAccount(request, response) {
  //const input = request.body;

  // check if the data is provided
  const email = request.body.email;
  const password = request.body.password;
  if (email === undefined || password === undefined) {
    return response.status(400).send("Give name, email and password");
  }
  if (email === "" || password === "") {
    return response.status(400).send("Give name, email and password");
  }

  // check the user exists and verify the password
  let dbResult1;
  const query1 = 'SELECT * FROM users WHERE email=?';
  try {
    dbResult1 = await queryDatabase(dbPool, query1, [email]);
  } catch (err) {
    console.log(err);
    return response.status(500).send('Error checking if the user exists in the database.');
  }
  if (dbResult1.length > 1) {
    return response.status(403).send('Email is not unique.');
  } else if (dbResult1.length < 1) {
    return response.status(403).send('No user with that email exists.');
  }
  if (!comparePassword(password, dbResult1[0].password)) {
    return response.status(403).send('Incorrect password.');
  }
  
  // delete user session if it exists
  try {
    await destroySession({ _email: email });
  } catch (err) {
    console.log(err);
    return response.status(500).send('Error while destroying any user sessions.');
  }

  // delete user from the DB
  let dbResult2;
  const query2 = 'DELETE FROM users WHERE email=?'
  try {
    await queryDatabase(dbPool, query2, [email]);
  } catch (err) {
    console.log(err);
    return response.status(500).send('Error deleting user from the database.');
  }

  console.log("User account successfully deleted.");
  return response.status(201).send();
}







/********* EXPORTS *********/

module.exports = router;
