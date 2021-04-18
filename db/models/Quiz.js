const { required } = require('joi')
const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        min: 8,
        max: 64,
    },
    date: {},
    views: {
        type: Number,
        default: 0,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    data: [
        {
            question: {
                type: String,
                required: true,
            },
            answers: [
                {
                    answer: {
                        type: String,
                        required: true,
                    },
                    isCorrect: {
                        type: Boolean,
                        required: true,
                    },
                },
            ],
        },
    ],
})

module.exports = new mongoose.model('quiz', quizSchema)
