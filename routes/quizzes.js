const router = require('express').Router()
const upload = require('../middlewares/upload')

const { createQuizValidation } = require('../validation/quizzes')

const Quiz = require('../db/models/Quiz')

router.get('/recentQuizzes', async (req, res) => {
    const { skip, limit } = req.query
    if (skip >= 0 && limit >= 0) {
        const quizzes = await Quiz.find({})
            .sort({ date: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        res.json(quizzes)
    }
})

router.get('/popularQuizzes', async (req, res) => {
    const { skip, limit } = req.query
    if (skip >= 0 && limit >= 0) {
        const quizzes = await Quiz.find({})
            .sort({ views: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        res.json(quizzes)
    }
})

router.post('/createQuiz', upload, (req, res) => {
    const { author, name, data, thumbnail } = req.body
    const { error } = createQuizValidation(req.body)
    if (error) {
        return res.json({ warning: error.details[0].message })
    }

    const quiz = new Quiz({
        author,
        name,
        thumbnail,
        data,
    })
    quiz.save()
        .then(data => res.json({ message: 'Quiz has been created' }))
        .catch(err => res.json({ error: 'Unexpected server error' }))
})

router.get('/getQuiz', (req, res) => {
    const { id } = req.query
    Quiz.findById(id)
        .then(data => {
            if (!data) {
                res.json({ error: 'Quiz not found' })
                return
            }
            res.json(data)
        })
        .catch(() => {
            res.json({ error: 'Unexpected server error' })
        })
})

router.put('/incrementViews', (req, res) => {
    const { id } = req.body
    Quiz.findByIdAndUpdate(id, { $inc: { views: 1 } })
})

module.exports = router
