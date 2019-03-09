const express = require('express')
const app = express()

// For logging
const morgan = require('morgan')
const mongoose = require('mongoose')

const userRoutes = require('./api/routes/users')
const noteRoutes = require('./api/routes/notes')

// Used to stop weird bugs to do with browser security
corsHandler = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'),
    res.header('Access-Control-Allow-Headers', '*')
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
}

errorHandler = (err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    })
    console.log(err)
}

notFoundHandler = (req, res, next) => {
    const error = new Error("Resource not found")
    error.status = 404
    next(error)
}


mongoose.connect(process.env.MONGO_ATLAS_URL, { useNewUrlParser: true })
mongoose.Prime = global.Promise
mongoose.connection.on('open', () => {
    console.log("Opened connection to database")
})

mongoose.connection.on('error', err => {
    console.log("Could not conenct to database")
    console.log(err)
})

app.use(morgan('dev'))
    .use(express.json())
    .use(corsHandler)
    .use('/users', userRoutes)
    .use('/notes', noteRoutes)
    .use(notFoundHandler)
    .use(errorHandler)

module.exports = app