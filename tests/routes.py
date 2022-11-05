# This script logs in a user and gets them to do something while logged in twice in a row

import requests as r
import time

def user_createAccount(user):
    """
    Params:

    User:
        Dictionary with name, email, password fields.
    """
    print("user_createAccount...")
    return r.post("http://dev.lan/api/user/createAccount/", data=user)

def user_deleteAccount(user):
    """
    Params:

    User:
        Dictionary with email, password fields.
    """
    print("user_deleteAccount...")
    return r.post("http://dev.lan/api/user/deleteAccount/", data=user)

def user_login(user):
    """
    Params:

    User:
        Dictionary with email, password fields.
    """
    print("user_login...")
    return r.post("http://dev.lan/api/user/login/", data=user)

def user_logout(accessToken, refreshToken):
    """
    Params:

    accessToken:

    refreshToken:

    """
    print("user_logout...")
    headers = { "accesstoken": accessToken, "refreshtoken": refreshToken }
    return r.post("http://dev.lan/api/user/logout/", headers=headers)

def user_doWhileLoggedIn(accessToken, refreshToken):
    """
    Params:

    accessToken:

    refreshToken:

    """
    print("user_doWhileLoggedIn...")
    headers = { "accesstoken": accessToken, "refreshtoken": refreshToken }
    return r.get("http://dev.lan/api/user/doWhileLoggedIn/", headers=headers)

if __name__ == "__main__":
    print("This file contains funcs that send requests to different api routes.")
