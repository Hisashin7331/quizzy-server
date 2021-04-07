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
    if (error) return res.json(error.details[0].message)

    const { username, password, repeatPassword } = req.body

    const userExist = await User.findOne({ username })
    if (userExist) {
        return res.json({
            message: 'User already exists',
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
        username,
        password: hashedPassword,
    })

    user.save()
        .then(data => {
            res.json({
                message: 'Account successfully created',
                data,
            })
        })
        .catch(err => {
            res.json(err)
        })
})

router.post('/login', async (req, res, next) => {
    const { error } = loginValidation(req.body)
    if (error) return res.json(error.details[0].message)

    const { username, password } = req.body

    User.findOne({ username })
        .then(user => {
            if (!user)
                return res.json({
                    message: 'Incorrect username or password',
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
                                username: user.username,
                            },
                            process.env.JWT_SECRET,
                        )
                        return res.header('auth-token', token).json({
                            token,
                            username: user.username,
                        })
                    } else {
                        return res.json({
                            message: 'Incorrect username or password',
                        })
                    }
                },
            )
        })
        .catch(err => console.log(err))

    // passport.authenticate('local')(req, res, next)
})

router.post('/logout', (req, res) => {
    req.logout()
})

module.exports = router
