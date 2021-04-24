const router = require('express').Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const {
    registerValidation,
    loginValidation,
} = require('../validation/auth')

const User = require('../db/models/User')

router.post('/register', async (req, res, next) => {
    const { error } = registerValidation(req.body)
    if (error) return res.json({ warning: error.details[0].message })

    const {
        email,
        username,
        password,
        avatar,
        preferences,
    } = req.body

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
                        return res.header('auth-token', token).json({
                            token,
                            username: user.username,
                            email: user.email,
                            avatar: user.avatar,
                            preferences: user.preferences,
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

module.exports = router
