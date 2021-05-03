const router = require('express').Router()
const upload = require('../middlewares/upload')
const auth = require('../middlewares/auth')
const getPreferences = require('../middlewares/getPreferences')

const { createQuizValidation } = require('../validation/quizzes')

const Quiz = require('../db/models/Quiz')
const User = require('../db/models/User')

router.get('/recentQuizzes', async (req, res) => {
    const { skip, limit } = req.query
    if (skip >= 0 && limit >= 0) {
        const quizzes = await Quiz.find({})
            .sort({ date: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        const modifiedQuizzes = await Promise.all(
            quizzes.map(async item => {
                const { username } = await User.findById(item.author)
                item.author = username
                return item
            }),
        )
        res.json(modifiedQuizzes)
    }
})

router.get('/popularQuizzes', async (req, res) => {
    const { skip, limit } = req.query
    if (skip >= 0 && limit >= 0) {
        const quizzes = await Quiz.find({})
            .sort({ views: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        const modifiedQuizzes = await Promise.all(
            quizzes.map(async item => {
                const { username } = await User.findById(item.author)
                item.author = username
                return item
            }),
        )
        res.json(modifiedQuizzes)
    }
})

router.get('/forYou', getPreferences, async (req, res) => {
    const { skip, limit } = req.query
    if (skip >= 0 && limit >= 0) {
        const quizzes = await Quiz.find({
            category: { $in: req.preferences },
        })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
        const modifiedQuizzes = await Promise.all(
            quizzes.map(async item => {
                const { username } = await User.findById(item.author)
                item.author = username
                return item
            }),
        )
        res.json(modifiedQuizzes)
    }
})

router.post('/createQuiz', upload, auth, (req, res) => {
    const { name, data, thumbnail, category } = req.body
    const { error } = createQuizValidation(req.body)
    if (error) {
        return res.json({ warning: error.details[0].message })
    }

    const quiz = new Quiz({
        author: req.userID,
        name,
        thumbnail,
        data,
        category,
    })
    quiz.save()
        .then(data => res.json({ message: 'Quiz has been created' }))
        .catch(err => res.json({ error: 'Unexpected server error' }))
})

router.get('/getQuiz', async (req, res) => {
    const { id } = req.query
    Quiz.findById(id)
        .then(data => {
            if (!data) {
                res.json({ error: 'Quiz not found' })
                return
            }
            const modifiedQuiz = data
            User.findById(data.author).then(result => {
                modifiedQuiz.data.forEach(item => {
                    item.answers.sort(() => Math.random() - 0.5)
                })
                modifiedQuiz.author = result.username
                res.json(modifiedQuiz)
            })
        })
        .catch(() => {
            res.json({ error: 'Unexpected server error' })
        })
})

router.put('/incrementViews', (req, res) => {
    const { id } = req.body
    Quiz.findByIdAndUpdate(id, { $inc: { views: 1 } }).then(() => {
        return
    })
})

router.get('/search', (req, res) => {
    const { query, limit, skip } = req.query
    if (query.length < 3) {
        Quiz.find({})
            .sort({ views: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .then(async quizzes => {
                const modifiedQuizzes = await Promise.all(
                    quizzes.map(async item => {
                        const { username } = await User.findById(
                            item.author,
                        )
                        item.author = username
                        return item
                    }),
                )
                res.json(modifiedQuizzes)
            })
            .catch(() =>
                res.json({ error: 'Unexpected server error' }),
            )
        return
    }

    Quiz.aggregate([
        {
            $search: {
                text: {
                    query,
                    path: ['name', 'category'],
                },
            },
        },
        {
            $project: {
                views: 1,
                author: 1,
                thumbnail: 1,
                name: 1,
                category: 1,
                data: 1,
                date: 1,
                score: {
                    $meta: 'searchScore',
                },
            },
        },
        {
            $sort: {
                score: -1,
            },
        },
    ])
        .skip(skip ? parseInt(skip) : 0)
        .limit(limit ? parseInt(limit) : 16)
        .then(async quizzes => {
            const modifiedQuizzes = await Promise.all(
                quizzes.map(async item => {
                    const { username } = await User.findById(
                        item.author,
                    )
                    item.author = username
                    return item
                }),
            )
            res.json(modifiedQuizzes)
        })
        .catch(() => res.json({ error: 'Unexpected server error' }))
})

module.exports = router
