const Multer = require('multer')

const uploadFile = Multer({
    storage: Multer.memoryStorage(),
}).single('file')
module.exports = uploadFile
