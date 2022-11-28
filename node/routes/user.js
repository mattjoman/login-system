/********* REQUIRED MODULES *********/
const { Router } = require('express');
const router = Router();

/********* MY MODULES *********/
const { login, logout } = require('../helpers/login');
const { authenticateToken, generateAccessToken, initSession, destroySession } = require('../helpers/token');

/********* /user/ ROUTES *********/
router.get('/', (request, response) => { response.send('You are at /api/user/') });
router.post('/login/', userLogin);
router.get('/doWhileLoggedIn/', authenticateToken, doWhileLoggedIn);
router.post('/logout/', authenticateToken, userLogout);

/********* FUNCTIONS *********/

/*
 * Middlewear is run before this function to verify the user's JWT.
 */
function doWhileLoggedIn(request, response) {
  return response.status(200).send();
}

/*
 * User login.
 */
function userLogin(request, response) {
  return login(request, response, false);
}

/*
 * User logout.
 */
function userLogout(request, response) {
  return logout(request, response);
}

/********* EXPORTS *********/
module.exports = router;
