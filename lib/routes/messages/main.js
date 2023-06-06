const router = require('express').Router()
const createMessage = require('./controllers/create.js')
const getPrivateMessages = require('./controllers/get.js')

router.route('/create').post(createMessage)
router.route('/private').get(getPrivateMessages)

module.exports = router