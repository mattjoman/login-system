/********* REQUIRED MODULES *********/
require('dotenv').config();
const jwt = require('jsonwebtoken');

/********* MY MODULES *********/
const { hashPassword, comparePassword } = require('./password');
const { dbPool, queryDatabase } = require('./dbQuery');
const { authenticateToken, generateAccessToken, initSession, destroySession } = require('./token');


/********* FUNCTIONS *********/

/*
 * User login.
 */
async function login(request, response, isAdmin) {

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

  // create user object, generate token and send to the client
  let user;
  if (isAdmin) {
    user = { _email: email, _admin: 1 };
  } else {
    user = { _email: email, _admin: 0 };
  }
  let { accessToken, refreshToken } = await initSession(user);
  response.setHeader('accesstoken', accessToken);
  response.setHeader('refreshtoken', refreshToken);
  response.status(201).send();
  return;
}


async function logout(request, response) {
  response.setHeader('accesstoken', null);
  response.setHeader('refreshtoken', null);
  const user = request.user;
  try {
    await destroySession(user);
  } catch (err) {
    console.log(err);
    return response.send("Could not destroy session.");
  }
  return response.send("User has successfully logged out. Now delete your tokens!");
}







/********* EXPORTS *********/

module.exports = {
  login,
  logout
};