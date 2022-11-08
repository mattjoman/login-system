/********* REQUIRED MODULES *********/
const { Router } = require('express');
const router = Router();

/********* MY MODULES *********/
const { authenticateToken, generateAccessToken, initSession, destroySession } = require('../helpers/token');
const { login, logout } = require('../helpers/login');

/********* /user/ ROUTES *********/
router.get('/', (request, response) => { response.send('You are at /api/user/') });
router.get('/doWhileLoggedIn/', authenticateToken, doWhileLoggedIn);
router.post('/login/', adminLogin);
router.post('/logout/', authenticateToken, adminLogout);

/********* FUNCTIONS *********/
/*
 * Middlewear is run before this function to verify the user's JWT.
 */
function doWhileLoggedIn(request, response) {
  console.log("Your JWT has been verified!");
  user = request.user;
  if (user === undefined) {
    return response.status(500).send("Send your JWT!");
  }
  if (user._admin != 1) {
    return response.status(403).send("You are not logged in as an admin!");
  }
  return response.status(201).json(request.user);
}

/*
 * Admin login.
 */
async function adminLogin(request, response) {
  return await login(request, response, true);
}

/*
 * Admin logout.
 */
async function adminLogout(request, response) {
  return await logout(request, response);
}

/********* EXPORTS *********/
module.exports = router;
