# login-system

# TODO
- Make a logout route and corresponding functionality.
- Edit admin.js to use the new refresh token system.
- Edit the login functions in user.js and admin.js to send the tokens in headers rather than in the body.
- Move the refresh_tokens table to a Redis cache.
- Make a cron container for sending requests to the refresh_tokens db/table to delete all expired refresh tokens.
- Make a front-end app in react, served by a dedicated container (sitting behind the nginx container).

# Notes
- Send the JWTs as cookies?
- Make a simple version of the login system that does not include refresh tokens / session db / logout functionality, since this could also be very useful.
