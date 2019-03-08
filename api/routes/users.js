const express = require('express')
const UserController = require('../controllers/users')
const checkAuth = require('../auth/check_auth')

const router = express.Router()

router.get('/', (req, res, next) => UserController.get_user_list(res))
router.post('/signup', (req, res, next) => UserController.user_signup(res, req.body.name, req.body.password))
router.post('/login', (req, res, next) => UserController.user_login(res, req.body.name, req.body.password))
router.delete('/:userId', checkAuth, (req, res, next) => UserController.user_delete(res, req.user, req.params.userId))

module.exports = router