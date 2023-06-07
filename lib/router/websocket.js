const jwt = require('jsonwebtoken')
const user = require('../models/user.js')

module.exports = async(Websocket, express, bodyparser) => {
    const app = express()

    app.use(bodyparser.json())
    app.use(bodyparser.urlencoded({ extended: true }))

    const server = app.listen(4000, () => {
        console.log(`Websocket Service: ${4000}`)
    })

    const wss = new Websocket.Server({
        noServer: true
    })

    server.on('upgrade', (req, socket, head) => {
        wss.handleUpgrade(req, socket, head, socket => {
            wss.emit('connection', socket, req)
        })
    })

    var Websockets = {}

    wss.on('connection', connection = async(ws, req) => {

        var { authorization } = req.headers
        var client = {}

        if (req.url.includes('auhorization')) {
            authorization = req.url.split('authorization=')[1]
        } else if (!authorization) {
            return ws.close()
        }

        const verif = jwt.verify(authorization, process.env.JWT)
        if (!verif.id) return ws.close()

        const Document = user.findById(verif.id)
        if (!Document) return ws.close()

        client = {
            id: verif.id,
            username: Document.username,
            CreatedAt: Document.CreatedAt
        };
        /*add client to Websockets*/
        Websockets[client.id] = ws

        ws.on('message', async(message) => {
            /*Exports messages to manage event*/
            require('./Manage/main.js')(ws, Websockets, message, client, user)
        })

    })

}