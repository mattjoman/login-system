# This script logs in a user and gets them to do something while logged in twice in a row

import requests as r
import time

from routes import *

def test_status(actual, expected):
    if actual != expected:
        print(f"Test failed:\n  Got status code {actual} but expected {expected}.")
        exit()
    return





def user_create_login_do_do_logout_delete():
    print()
    print("="*30)
    print("Running user_create_login_do_do_logout_delete()...\n\n")
    """ Tests user_login, user_doWhileLoggedIn """
    data = {
        "name": "user",
        "email": "user@test.com",
        "password": "test123"
    }

    response = user_createAccount(data)
    test_status(response.status_code, 201)
    response = user_login(data)
    test_status(response.status_code, 200)
    response = user_doWhileLoggedIn(response.headers['accesstoken'], response.headers['refreshtoken'])
    test_status(response.status_code, 200)
    response = user_doWhileLoggedIn(response.headers['accesstoken'], response.headers['refreshtoken'])
    test_status(response.status_code, 200)
    response = user_logout(response.headers['accesstoken'], response.headers['refreshtoken'])
    test_status(response.status_code, 200)
    response = deleteAccount(data)
    test_status(response.status_code, 201)

    print("\nTest passed.")
    print("="*30)
    print()

    return


def admin_create_login_do_do_logout_delete():
    """ Tests user_login, user_doWhileLoggedIn """
    print()
    print("="*30)
    print("Running user_create_login_do_do_logout_delete()...\n\n")
    data = {
        "name": "user",
        "email": "user@test.com",
        "password": "test123"
    }

    response = admin_createAccount(data)
    test_status(response.status_code, 201)
    response = admin_login(data)
    test_status(response.status_code, 200)
    response = admin_doWhileLoggedIn(response.headers['accesstoken'], response.headers['refreshtoken'])
    test_status(response.status_code, 200)
    response = admin_doWhileLoggedIn(response.headers['accesstoken'], response.headers['refreshtoken'])
    test_status(response.status_code, 200)
    response = admin_logout(response.headers['accesstoken'], response.headers['refreshtoken'])
    test_status(response.status_code, 200)
    response = deleteAccount(data)
    test_status(response.status_code, 201)

    print("\nTest passed.")
    print("="*30)
    print()

    return


def user_login_as_admin():
    """ Create user account, try to log in as admin """
    print()
    print("="*30)
    print("Running user_login_as_admin()...\n\n")
    data = {
        "name": "user",
        "email": "user@test.com",
        "password": "test123"
    }
    response = user_createAccount(data)
    response = admin_login(data)
    test_status(response.status_code, 403)
    response = deleteAccount(data)

    print("\nTest passed.")
    print("="*30)
    print()

    return

def user_do_as_admin():
    """ Create user account, try to log in as admin """
    print()
    print("="*30)
    print("Running user_do_as_admin()...\n\n")
    data = {
        "name": "user",
        "email": "user@test.com",
        "password": "test123"
    }
    response = user_createAccount(data)
    response = user_login(data)
    response = admin_doWhileLoggedIn(response.headers['accesstoken'], response.headers['refreshtoken'])
    test_status(response.status_code, 403)
    response = deleteAccount(data)

    print("\nTest passed.")
    print("="*30)
    print()

    return





def bad_requests():
    """Tests with bad bodies."""
    print()
    print("="*30)
    print("Running bad_requests()...\n\n")
    response = user_createAccount(
        {
            "name": "",
            "email": "",
            "password": ""
        }
    )
    test_status(response.status_code, 400)

    response = user_createAccount({})
    test_status(response.status_code, 400)

    print("\nTest passed.")
    print("="*30)
    print()

    return
