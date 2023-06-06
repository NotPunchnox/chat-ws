const mongoose = require('mongoose')

module.exports = mongoose.model('Message', new mongoose.Schema({
    _id: Number,
    author: Number,
    to: Number,
    content: {
        required: true,
        type: String
    },
    CreatedAt: {
        default: new Date(),
        type: Date,
        required: true
    }
}, {
    versionKey: false
}))