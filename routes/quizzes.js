const router = require('express').Router()
const upload = require('../middlewares/upload')

const { createQuizValidation } = require('../validation/quizzes')

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

router.post('/createQuiz', upload, (req, res) => {
    const { author, name, data, thumbnail } = req.body
    const { error } = createQuizValidation(req.body)
    if (error) {
        return res.json(error.details[0].message)
    }

    const quiz = new Quiz({
        author,
        name,
        thumbnail,
        data,
    })
    quiz.save()
        .then(data => res.json(data))
        .catch(err => res.json(err))
})

module.exports = router
