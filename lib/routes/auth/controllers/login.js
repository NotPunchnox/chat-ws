const jwt = require('jsonwebtoken')
const Response = require('../../../utils/helper/Response.js')
const user = require('../../../models/user.js')

module.exports = async(req, res) => {
    const authorization = req.headers.authorization

    if (!authorization) return res.status(400).json(Response.badrequest)

    jwt.verify(authorization, process.env.JWT, async(err, decoded) => {

        if (err != null) return res.status(500).json(Response.internalservererror), console.log("ERROR:", err)

        console.log('DECODED:', decoded)
        if (decoded.id != null) {
            const userDoc = await user.findById(decoded.id)
            if (userDoc == null) return res.status(404).json(Response.notfound)
            return res.status(200).json(new Response(200, { id: userDoc.id, username: userDoc.username, CreatedAt: userDoc.CreatedAt }))
        } else {
            return res.status(400).json(Response.badrequest)
        }

    })

}