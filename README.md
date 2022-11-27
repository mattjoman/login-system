# login-system

# TODO
- Move things like the expiration times to .env file.
- Look for potential vulnerabilities like sql injection.
- Move the refresh\_tokens table to a Redis cache.
- Make a cron container for sending requests to the refresh\_tokens db/table to delete all expired refresh tokens.
- Make a front-end app in react, served by a dedicated container (sitting behind the nginx container).

# Notes
- Send the JWTs as cookies?
- Make a simple version of the login system that does not include refresh tokens / session db / logout functionality, since this could also be very useful.
