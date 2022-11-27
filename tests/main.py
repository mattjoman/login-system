# This script logs in a user and gets them to do something while logged in twice in a row

import requests as r
import time

from tests import *


if __name__ == "__main__":
    user_create_login_do_do_logout_delete()
    admin_create_login_do_do_logout_delete()
    bad_requests()
