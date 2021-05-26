const router = require('express').Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')

const {
    registerValidation,
    loginValidation,
} = require('../validation/auth')

const User = require('../db/models/User')
const Quiz = require('../db/models/Quiz')

router.post('/register', async (req, res, next) => {
    const { error } = registerValidation(req.body)
    if (error) return res.json({ warning: error.details[0].message })

    const { email, username, password, avatar, preferences } =
        req.body

    const usernameExist = await User.findOne({ username })
    const emailExist = await User.findOne({ email })
    if (usernameExist || emailExist) {
        return res.json({
            warning: 'User already exists',
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
        email,
        username,
        password: hashedPassword,
        avatar,
        preferences,
    })

    user.save()
        .then(data => {
            res.json({
                message: 'Account successfully created',
                data,
            })
        })
        .catch(err => {
            res.json({ error: 'Unexpected server error' })
        })
})

router.post('/login', async (req, res, next) => {
    const { error } = loginValidation(req.body)
    if (error) return res.json({ warning: error.details[0].message })

    const { email, password } = req.body

    User.findOne({ email })
        .then(user => {
            if (!user)
                return res.json({
                    warning: 'Incorrect email or password',
                })
            bcrypt.compare(
                password,
                user.password,
                (err, isMatch) => {
                    if (err) throw err
                    if (isMatch) {
                        const token = jwt.sign(
                            {
                                _id: user._id,
                            },
                            process.env.JWT_SECRET,
                        )
                        const {
                            avatar,
                            email,
                            preferences,
                            username,
                        } = user
                        return res.header('auth-token', token).json({
                            token,
                            avatar,
                            email,
                            preferences,
                            username,
                        })
                    } else {
                        return res.json({
                            warning: 'Incorrect username or password',
                        })
                    }
                },
            )
        })
        .catch(err => res.json({ error: 'Unexpected server error' }))
})

router.get('/getUserQuizzes', auth, async (req, res) => {
    Quiz.find({
        author: req.userID,
    })
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.json({ error: 'Server error' })
        })
})

router.get('/getViews', auth, async (req, res) => {
    Quiz.find({
        author: req.userID,
    })
        .then(data => {
            let views = 0
            data.forEach(item => {
                views += item.views
            })
            res.json(views)
        })
        .catch(error => {
            res.json({ error: 'Server error' })
        })
})

router.put('/update', auth, async (req, res) => {
    const { email, username, password } = req.body
    let hashedPassword = undefined
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10)
    }
    User.findById(req.userID).then(doc => {
        doc.email = email || doc.email
        doc.username = username || doc.username
        doc.password = hashedPassword || doc.password
        doc.save((error, response) => {
            res.json({
                email: response.email,
                username: response.username,
            })
        })
    })
})

module.exports = router
