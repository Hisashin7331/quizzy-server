const jwt = require('jsonwebtoken')

const getPreferences = async (req, res, next) => {
    const token = req.headers.auth.split(' ')[1]
    if (token) {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        req.preferences = decodedData?.preferences
        next()
    } else {
        return res.json('You must be logged in to to it')
    }
}

module.exports = getPreferences
