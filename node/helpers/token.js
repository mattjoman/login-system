require('dotenv').config();
const jwt = require('jsonwebtoken');

/*
 * Middlewear.
 */
function authenticateToken(request, response, next) {
  const authHeader = request.headers['authorization'];
  const token = authHeader.split(' ')[1];
  if (token == null) return response.status(401).json(request.headers);

  console.log('User is being verified');

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return response.status(403).send("couldn't verify");
    request.user = user; // Add 'user' object to request so we can get info later on.
    next();
  });
}

/*
*/
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '100s'});
}

module.exports = {
  authenticateToken,
  generateAccessToken
};
