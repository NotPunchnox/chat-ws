module.exports = (express, bodyparser) => {

    /* Import modules */
    const app = express()
    const routes = require('../routes/main.js')

    /* Config server */
    app.use(bodyparser.json())
    app.use(bodyparser.urlencoded({ extended: true }))

    /* Routes */
    app.use('/auth', routes.auth)
    app.use('/message', routes.message)

    /* Start server */
    app.listen(8080, (error) => {
        if (error != null) return console.error(new Error(error))
    })

}