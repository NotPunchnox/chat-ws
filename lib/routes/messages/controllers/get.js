const jwt = require('jsonwebtoken')
const Response = require('../../../utils/helper/Response.js')
const flake = require('../../../utils/functions/flake.js').default
const user = require('../../../models/user.js')
const message = require('../../../models/message.js')

module.exports = async(req, res) => {
    const authorization = req.headers.authorization
    const { to, conversation } = req.body

    if (!authorization) return res.status(400).json(Response.badrequest)
    if (to && typeof to != 'number') return res.status(400).json(Response.badrequest)
    if (conversation && typeof conversation != 'number') return res.status(400).json(Response.badrequest)

    jwt.verify(authorization, process.env.JWT, async(err, decoded) => {
        if (err != null) return res.status(500).json(Response.internalservererror), console.log("ERROR:", err)
        if (!decoded.id) return res.status(403).json(Response.unauthorized)

        if (to) {
            if (!await user.findById(decoded.id)) return res.status(403).json(Response.unauthorized)
            if (!await user.findById(Number(to))) return res.status(404).json(Response.notfound)

            const messages = await message.find({ to: to }).catch(err => {
                return console.error(new Error(err)), res.status(500).json(new Response(500, err))
            })

            return res.status(200).json(new Response(200, messages))
        } else if (conversation) {
            //GROUPE
        } else return res.status(500).json(Response.error)


    })

}