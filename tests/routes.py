# This script logs in a user and gets them to do something while logged in twice in a row

import requests as r
import time

def user_createAccount(data):
    """
    Params:

    User:
        Dictionary with name, email, password fields.
    """
    print("user_createAccount...")
    return r.post("http://dev.lan/api/account/create/", data=data)

def deleteAccount(data):
    """
    Params:

    User:
        Dictionary with email, password fields.
    """
    print("deleteAccount...")
    return r.post("http://dev.lan/api/account/delete/", data=data)

def user_login(data):
    """
    Params:

    User:
        Dictionary with email, password fields.
    """
    print("user_login...")
    return r.post("http://dev.lan/api/user/login/", data=data)

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









def admin_createAccount(data):
    """
    Params:

    User:
        Dictionary with name, email, password fields.
    """
    print("admin_createAccount...")
    return r.post("http://dev.lan/api/account/createAdmin/", data=data)

def admin_login(data):
    """
    Params:

    User:
        Dictionary with email, password fields.
    """
    print("admin_login...")
    return r.post("http://dev.lan/api/admin/login/", data=data)

def admin_logout(accessToken, refreshToken):
    """
    Params:

    accessToken:

    refreshToken:

    """
    print("admin_logout...")
    headers = { "accesstoken": accessToken, "refreshtoken": refreshToken }
    return r.post("http://dev.lan/api/admin/logout/", headers=headers)

def admin_doWhileLoggedIn(accessToken, refreshToken):
    """
    Params:

    accessToken:

    refreshToken:

    """
    print("admin_doWhileLoggedIn...")
    headers = { "accesstoken": accessToken, "refreshtoken": refreshToken }
    return r.get("http://dev.lan/api/admin/doWhileLoggedIn/", headers=headers)







if __name__ == "__main__":
    print("This file contains funcs that send requests to different api routes.")
