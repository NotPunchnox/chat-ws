const jwt = require('jsonwebtoken')
const Response = require('../../../utils/helper/Response.js')
const flake = require('../../../utils/functions/flake.js').default
const user = require('../../../models/user.js')
const message = require('../../../models/message.js')

module.exports = async(req, res) => {
    const authorization = req.headers.authorization
    const { content, to } = req.body

    if (!authorization || !req.body || !content || !to || typeof to != 'number') return res.status(400).json(Response.badrequest)

    jwt.verify(authorization, process.env.JWT, async(err, decoded) => {
        if (err != null) return res.status(500).json(Response.internalservererror), console.log("ERROR:", err)
        if (!decoded.id) return res.status(403).json(Response.unauthorized)

        if (!await user.findById(decoded.id)) return res.status(403).json(Response.unauthorized)
        if (!await user.findById(Number(to))) return res.status(404).json(Response.notfound)

        if (Number(to) === Number(decoded.id)) return res.status(400).json(new Response(400, `sender id: ${decoded.id}, user id: ${to}`))

        message.create({
            _id: flake.gen(),
            author: decoded.id,
            to: to,
            content: content,
            CreatedAt: Date.now()
        }).then((a) => {
            return res.status(201).json(new Response(201, a))
        }).catch(err => {
            return console.error(new Error(err)), res.status(500).json(new Response(500, err))
        })

    })

}