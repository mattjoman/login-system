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

async function create(request, response) {
  return await createAccount(request, response, false);
}

async function createAdmin(request, response) {
  return await createAccount(request, response, true);
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
    response.status(500).send();
    return;
  }
  console.log(dbResult2);
  console.log("Secret: " + process.env.ACCESS_TOKEN_SECRET);
  response.status(201).send("Successfully created new account: " + process.env.ACCESS_TOKEN_SECRET);
  return;
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
    return response.status(500).send("Give name, email and password");
  }

  // check the user exists and verify the password
  let dbResult1;
  const query1 = 'SELECT * FROM users WHERE email=?';
  try {
    dbResult1 = await queryDatabase(dbPool, query1, [email]);
  } catch (err) {
    console.log(err);
    return response.status(500).send();
  }
  if (dbResult1.length > 1) {
    console.log('Email is not unique!');
    return response.status(403).send('Email is not unique');
  } else if (dbResult1.length < 1) {
    console.log('Email is does not exist in the DB!');
    return response.status(403).send();
  }
  if (!comparePassword(password, dbResult1[0].password)) {
    console.log('Incorrect password!');
    return response.status(403).send('Incorrect password');
  }
  
  // delete user session if it exists
  try {
    await destroySession({ _email: email });
  } catch (err) {
    console.log('Could not destroy session.');
    return response.status(502).send();
  }

  // delete user from the DB
  let dbResult2;
  const query2 = 'DELETE FROM users WHERE email=?'
  try {
    await queryDatabase(dbPool, query2, [email]);
  } catch (err) {
    console.log('Could not delete user from the DB!');
    return response.status(502).send();
  }

  console.log("User account successfully deleted.");
  return response.status(201).send();
}







/********* EXPORTS *********/

module.exports = router;
