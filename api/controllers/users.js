const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

function illegalUserName(res, userName) {
    return res.status(406).json({
        message: 'User name must be at least 4 characters long'
    })
}

function createNewUser(res, userName, password) {
    bcrypt.hash(password, 10)
        .then(hash => {
            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                name: userName,
                password: hash
            }).save()
              .then(user => {
                    res.status(201).json({
                        message: 'User created',
                        user: user
                    })
              })
              .catch(err => {
                res.status(500).json({
                    message: 'Error creating user',
                    error: err
                })
              })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error creating user',
                error: err
            })
        })
}

function isValidUserName(userName) {
    return userName && userName.length > 3
}

function grantAccessToken(res, user) {
    const token = jwt.sign({
        id: user._id,
        name: user.name
    }, process.env.JWT_KEY, {
        expiresIn: "1hour"
    })

    res.status(200).json({
        message: 'Auth successful',
        token: token
    })

}

function tryLoginUser(res, user, password) {
    bcrypt.compare(password, user.password)
        .then(result => {
            if(result) {
                grantAccessToken(res, user)
            } else {
                authFailed(res)
            }
        })
        .catch(e => {
            authFailed(res)
        })
}

function authFailed(res) {
    res.status(401).json({
        message: 'Auth failed'
    })
}

module.exports.user_signup = (res, userName, password) => {
    if(!isValidUserName(userName)) {
        return illegalUserName(res, userName)
    }

    User.find({ name: userName })
        .exec()
        .then(users => {
            if(users.length > 0) {
                return Promise.reject('Already Exists')
            }
        })
        .then(() => {
            createNewUser(res, userName, password)
        })
        .catch(err => {
            if(err != 'Already Exists') {
                res.status(409).json({
                    message: 'User already exists',
                    name: userName
                })
            } else {
                res.status(500).json({
                    message: 'Error creating user',
                    error: err
                })
            }
        })
}

module.exports.user_login = (res, userName, password) => {
    if(!isValidUserName(userName)) {
        return illegalUserName(res, userName)
    }

    User.find({ name: userName })
        .exec()
        .then(users => {
            if(users.length == 0) {
                return Promise.reject('Not found')
            } else {
                return users[0]
            }
        })
        .then((user) => {
            tryLoginUser(res, user, password)
        })
        .catch(err => {
            authFailed(res)
        })
}

module.exports.user_delete = (res, loggedInUser, userId) => {
    if(!loggedInUser._id.equals(userId)) {
        return res.status(401).json({
            message: 'Not authorised to delete user',
            userId: userId,
            user: loggedInUser
        })
    }
    User.remove({ _id: userId })
        .exec()
        .then(result => {
            if(result) {
                res.status(200).json({
                    message: 'User deleted',
                    userId: userId
                })
            } else {
                res.status(404).json({
                    message: 'User not found',
                    userId: userId
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Error deleting user',
                userId: userId,
                error: err
            })
        })
}

module.exports.get_user_list = (res) => {
    User.find()
        .select('-password')
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        })
        .catch(err => {
            res.status(500).json({
                mesesage: 'Error fetching user list',
                error: err
            })
        })
}