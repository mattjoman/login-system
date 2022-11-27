# This script logs in a user and gets them to do something while logged in twice in a row

import requests as r
import time

from routes import *

def user_create_login_do_do_logout_delete():
    """ Tests user_login, user_doWhileLoggedIn """
    data = {
        "name": "user",
        "email": "user@test.com",
        "password": "test123"
    }

    print()

    response = user_createAccount(data)
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print()

    print(1)
    response = user_login(data)
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print(f"accesstoken: {response.headers['accesstoken']}")
    print()

    print(2)
    response = user_doWhileLoggedIn(response.headers['accesstoken'], response.headers['refreshtoken'])
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print(f"accesstoken: {response.headers['accesstoken']}")
    print()

    print(3)
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

    response = deleteAccount(data)
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print()

    return


def admin_create_login_do_do_logout_delete():
    """ Tests user_login, user_doWhileLoggedIn """
    data = {
        "name": "user",
        "email": "user@test.com",
        "password": "test123"
    }

    print()

    response = admin_createAccount(data)
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print()

    response = admin_login(data)
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print(f"accesstoken: {response.headers['accesstoken']}")
    print()

    response = admin_doWhileLoggedIn(response.headers['accesstoken'], response.headers['refreshtoken'])
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print(f"accesstoken: {response.headers['accesstoken']}")
    print()

    response = admin_doWhileLoggedIn(response.headers['accesstoken'], response.headers['refreshtoken'])
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print(f"accesstoken: {response.headers['accesstoken']}")
    print()

    response = admin_logout(response.headers['accesstoken'], response.headers['refreshtoken'])
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print(f"accesstoken: {response.headers['accesstoken']}")
    print()

    #response = user_deleteAccount({ "email": user["email"], "password": user["password"] });
    response = deleteAccount(data)
    print(f"Status code: {response.status_code}")
    print(f"Body: {response.text}")
    print()

    return








def bad_requests():
    response = user_createAccount(
        {
            "name": "",
            "email": "",
            "password": ""
        }
    )
    if response.status_code != 400:
        print(f"Expected 400, got {response.status_code}")
        return

    response = user_createAccount({})
    if response.status_code != 400:
        print(f"Expected 400, got {response.status_code}")
        return

    print("Test passed")

    return
