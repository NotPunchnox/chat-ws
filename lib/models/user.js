const mongoose = require('mongoose')

module.exports = mongoose.model('user', new mongoose.Schema({
    _id: Number,
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    CreatedAt: {
        default: new Date(),
        type: Date,
        required: true
    }
}, {
    versionKey: false
}))