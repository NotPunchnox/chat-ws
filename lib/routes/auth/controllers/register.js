const jwt = require('jsonwebtoken')
const Response = require('../../../utils/helper/Response.js')
const user = require('../../../models/user.js')
const bcrypt = require('bcrypt')
const flake = require('../../../utils/functions/flake.js').default

module.exports = async(req, res) => {
    console.log("LOG:", req.body)
    if (!req.body) return res.status(400).json(Response.badrequest)
    var {
        username,
        password
    } = req.body


    if (!username) {
        return res.status(400).json(new Response(400, 'No username field found.'))
    } else if (!password) {
        return res.status(400).json(new Response(400, 'No password field found.'))
    } else if (password.length < 6) {
        return res.status(400).json(new Response(400, 'The password given is too short.'))
    }

    if (await user.findOne({ username })) return res.status(403).json(new Response(400, 'Username is already used'))

    user_id = flake.gen()


    await user.create({
        _id: user_id,
        username: username,
        password: await bcrypt.hash(password, await bcrypt.genSalt(12)),
        createdAt: Date.now()
    })

    let token = jwt.sign({
        id: user_id
    }, process.env.JWT)

    return res.status(201).json(new Response(201, { token: token }))


}