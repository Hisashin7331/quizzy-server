const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        min: 6,
        max: 24,
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    avatar: {
        type: String,
    },
    preferences: [String],
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('User', userSchema)
