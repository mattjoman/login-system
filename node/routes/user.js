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
  console.log("Your JWT has been verified, now do something while logged in!");
  return response.json(request.user).status(200);
}

/*
 * User login.
 */
async function userLogin(request, response) {
  return await login(request, response, false);
}

/*
 * User logout.
 */
async function userLogout(request, response) {
  return await logout(request, response);
}

/********* EXPORTS *********/
module.exports = router;
