module.exports = async(ws, Websockets, message, _, user, authorization) => {

    if (!message) return ws.send(JSON.stringify({
        type: 'error',
        data: {
            message: 'Message not found'
        }
    }))

    const verif = async to => {
        const Document = await user.findById(to)
        if (!Document) return ws.send(JSON.stringify({
            type: 'error',
            data: {
                message: 'User not found'
            }
        })), true

        if (!Websockets[to]) return false
        return true
    }

    message = JSON.parse(message)
    const { type, data } = message
    if (!type || !data || !data.from || !data.message) return ws.send(JSON.stringify({
        type: 'error',
        data: {
            message: 'Type or data not found'
        }
    }))

    switch (type) {

        case 'message':
            const result = verif(data.from)
            if (!result) return

            console.log(Object.keys(Websockets))

            if (Websockets[Number(data.from)]) {
                Websockets[Number(data.from)].send(JSON.stringify({
                    type: 'message',
                    data: {
                        message: data.message,
                        from: Number(data.from),
                        CreatedAt: Date.now()
                    }
                }))
            } else {
                require('request').post('http://localhost:8080/message/create', {
                    body: {
                        content: data.message,
                        to: Number(data.from),
                    },
                    headers: {
                        authorization: authorization
                    },
                    json: true
                }, (err, res, body) => {
                    if (err) return console.log(err)
                    console.log(body)
                })
            }
            break;

        case 'typing':
            const { typing, to } = data


        default:
            return
    }

}