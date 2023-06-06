const mongoose = require('mongoose')
const Websocket = require('ws')
const dotenv = require('dotenv')
const express = require('express')
const bodyparser = require('body-parser')

dotenv.config()

mongoose.connect(`mongodb+srv://admin:${process.env.PASS}@cluster0.hgtddgv.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    console.log('Connected to database')
}).catch((err) => {
    console.error(new Error(err))
})

const router = require('./lib/router/main.js')

router.rest(express, bodyparser)
router.websocket(Websocket, express, bodyparser)