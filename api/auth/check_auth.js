const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.headers.authorization, process.env.JWT_KEY)
        req.user = new User({
            _id: decoded.id,
            name: decoded.name
        })
        next()
    } catch(err) {
        if(err.name && err.name == "TokenExpiredError") {
            return res.status(401).json({
                message: 'Token expired'
            })
        } else {
            console.log(err)
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
    }
}