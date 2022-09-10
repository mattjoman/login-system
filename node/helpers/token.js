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
    request.user = {
      email: request.body.email, // set request.user
    };
    next();
  });
}

/*
*/
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'});
}

module.exports = {
  authenticateToken,
  generateAccessToken
};
