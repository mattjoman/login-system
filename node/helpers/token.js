require('dotenv').config();
const jwt = require('jsonwebtoken');
const { dbPool, queryDatabase } = require('./dbQuery');

async function refreshSession(err, user) {
  if (!err) {
  }
};

/*
 * Middlewear.
 */
async function authenticateToken(request, response, next) {
  const accessToken = request.headers['accesstoken'];
  const refreshToken = request.headers['refreshtoken'];

  if (accessToken == null) return response.status(401).json(request.headers);
  if (refreshToken == null) return response.status(401).json(request.headers);

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (!err) {
      request.user = user;
      let newTokens;
      try {
        newTokens = await initSession({ _email: user._email, _admin: user._admin });
      } catch (err) {
        console.log(err);
        return response.send("Could not refresh the session.");
      }
      response.setHeader('accesstoken', newTokens.accessToken);
      response.setHeader('refreshtoken', newTokens.refreshToken);
      next();

    } else {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (!err) {
          request.user = user;
          // check if the user has a session (they may have logged out)
          const query1 = "SELECT JWT FROM refresh_tokens WHERE email=?";
          let dbResult1;
          try {
            dbResult1 = await queryDatabase(dbPool, query1, [user._email]);
          } catch (err) {
            return response.send("Error while querying database!");
          }
          if (dbResult1.length != 1) {
            return response.send("User does not have a session! Must log in!");
          }
          if (dbResult1[0].JWT != refreshToken) {
            return response.send("Refresh token does not match the one in the database");
          }
          console.log("User still has a valid session, now creating new tokens.");

          let newTokens;
          try {
            newTokens = await initSession({ _email: user._email, _admin: user._admin });
          } catch (err) {
            console.log(err);
            return response.send("Could not refresh the session.");
          }
          response.setHeader('accesstoken', newTokens.accessToken);
          response.setHeader('refreshtoken', newTokens.refreshToken);
          next();
        } else {
          if (err) return response.status(403).send("couldn't verify");
        }
      });
    }
    return;
  });
}

/*
*/
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10s'});
}

/*
*/
function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '10m'});
}

/*
*/
async function initSession(user) {
  
  // delete any pre-existing sessions for the user
  let dbResult1;
  const query1 = 'DELETE FROM refresh_tokens WHERE email=?';
  dbResult1 = await queryDatabase(dbPool, query1, [user._email]);

  // create JWTs
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // create new session
  let dbResult2;
  const query2 = 'INSERT INTO refresh_tokens VALUES (?, ?)';
  dbResult2 = await queryDatabase(dbPool, query2, [user._email, refreshToken]);

  // return the tokens
  return {
    accessToken: accessToken,
    refreshToken: refreshToken
  };
}

async function destroySession(user) {
  // delete any pre-existing sessions for the user
  let dbResult1;
  const query1 = 'DELETE FROM refresh_tokens WHERE email=?';
  dbResult1 = await queryDatabase(dbPool, query1, [user._email]);
  return;
}

module.exports = {
  authenticateToken,
  generateAccessToken,
  initSession,
  destroySession
};
