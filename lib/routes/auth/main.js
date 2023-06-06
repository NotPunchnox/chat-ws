const router = require('express').Router()
const registerController = require('./controllers/register.js')
const loginController = require('./controllers/login.js')

router.route('/register').post(registerController)
router.route('/login').post(loginController)

module.exports = router