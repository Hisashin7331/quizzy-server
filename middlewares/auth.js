const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    if (req.headers.auth) {
        const token = req.headers.auth.split(' ')[1]
        if (token) {
            const decodedData = jwt.verify(
                token,
                process.env.JWT_SECRET,
            )
            req.userID = decodedData?._id
            next()
        } else {
            return res.json('You must be logged in to upload quizzes')
        }
    } else {
        return res.json('You must be logged in to upload quizzes')
    }
}

module.exports = auth
