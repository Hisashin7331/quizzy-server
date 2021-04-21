const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/../public/images`)
    },
    filename: (req, file, cb) => {
        const splittedFile = file.originalname.split('.')
        const extenstion = splittedFile[splittedFile.length - 1]
        cb(null, `${uuidv4()}.${extenstion}`)
    },
})

const uploadFile = multer({ storage }).single('file')
module.exports = uploadFile
