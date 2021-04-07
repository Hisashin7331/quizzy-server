const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// const passportJWT = require('passport-jwt')

// const JWTStrategy = passportJWT.Strategy

const User = require('../db/models/User')

module.exports = passport => {
    passport.use(
        new LocalStrategy((username, password, done) => {
            User.findOne({ username })
                .then(user => {
                    if (!user)
                        return done(null, false, {
                            message: 'User not found',
                        })
                    bcrypt.compare(
                        password,
                        user.password,
                        (err, isMatch) => {
                            if (err) throw err
                            if (isMatch) {
                                return done(null, user)
                            } else {
                                return done(null, false, {
                                    message: 'Password incorrect',
                                })
                            }
                        },
                    )
                })
                .catch(err => console.log(err))
        }),
    )

    // passport.use(
    //     JWTStrategy(
    //         {
    //             jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    //             secretOrKey: process.env.JWT_SECRET,
    //         },
    //         (payload, done) => {
    //             User.findOne({ _id: payload.user._id })
    //                 .then(user => {
    //                     return done(null, user)
    //                 })
    //                 .catch(err => {
    //                     return done(null, false, {
    //                         message: 'Token not matched',
    //                     })
    //                 })
    //         },
    //     ),
    // )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}
