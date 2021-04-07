const router = require('express').Router()

const { createQuizValidation } = require('../validation/quizes')

const Quiz = require('../db/models/Quiz')

router.get('/recentQuizzes', async (req, res) => {
    const { skip, limit } = req.query
    if (skip >= 0 && limit >= 0) {
        const quizes = await Quiz.find({})
            .sort({ date: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        res.json(quizes)
    }
})

router.get('/popularQuizzes', async (req, res) => {
    const { skip, limit } = req.query
    if (skip >= 0 && limit >= 0) {
        const quizes = await Quiz.find({})
            .sort({ views: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        res.json(quizes)
    }
})

router.post('/createQuiz', (req, res) => {
    const { error } = createQuizValidation(req.body)
    if (error) {
        return res.json(error.details[0].message)
    }

    const { author, name, data } = req.body
    const quiz = new Quiz({
        author,
        name,
        data,
    })
    quiz.save()
        .then(data => res.json(data))
        .catch(err => res.json(err))
})

module.exports = router
