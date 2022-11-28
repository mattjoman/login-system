# login-system

# TODO
- Move things like the expiration times to .env file, use it for tests.
- Look for potential vulnerabilities like sql injection.
- Add tests to make sure the access/refresh tokens are being used appropriately.
- Make a database user.
- Make an admin secret that must be provided to create an admin account?
- Move the refresh\_tokens table to a Redis cache.
- Make a cron container for sending requests to the refresh\_tokens db/table to delete all expired refresh tokens.

# Notes
- Send the JWTs as cookies?
- Make a simple version of the login system that does not include refresh tokens / session db / logout functionality, since this could also be very useful.
