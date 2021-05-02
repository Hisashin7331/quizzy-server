const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const storage = multer.diskStorage({
    destination: (req, file, next) => {
        next(null, `${__dirname}/../public/images`)
    },
    filename: (req, file, next) => {
        const splittedFile = file.originalname.split('.')
        const extenstion = splittedFile[splittedFile.length - 1]
        next(null, `${uuidv4()}.${extenstion}`)
    },
})

const uploadFile = multer({ storage }).single('file')
module.exports = uploadFile
