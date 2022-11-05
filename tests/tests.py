# This script logs in a user and gets them to do something while logged in twice in a row

import requests as r
import time

from routes import *

def create_login_do_do_logout_delete():
    """ Tests user_login, user_doWhileLoggedIn """
    user = {
        "name": "user",
        "email": "user@test.com",
        "password": "test123"
    }

    print()

    response = user_createAccount(user)
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print()

    response = user_login(user)
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print(f"accesstoken: {response.headers['accesstoken']}")
    print()

    response = user_doWhileLoggedIn(response.headers['accesstoken'], response.headers['refreshtoken'])
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print(f"accesstoken: {response.headers['accesstoken']}")
    print()

    response = user_doWhileLoggedIn(response.headers['accesstoken'], response.headers['refreshtoken'])
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print(f"accesstoken: {response.headers['accesstoken']}")
    print()

    response = user_logout(response.headers['accesstoken'], response.headers['refreshtoken'])
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print(f"accesstoken: {response.headers['accesstoken']}")
    print()

    #response = user_deleteAccount({ "email": user["email"], "password": user["password"] });
    response = user_deleteAccount(user);
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print()

    return
