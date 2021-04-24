import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
    const token = req.headers.auth.split(' ')[1]
    if (token) {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        req.userID = decodedData?.id
        next()
    }
}
