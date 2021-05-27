const router = require('express').Router()
const upload = require('../middlewares/upload')
const path = require('path')
const { Storage } = require('@google-cloud/storage')
const { format } = require('util')
const { v4: uuidv4 } = require('uuid')

const googleCloud = new Storage({
    keyFilename: path.join(
        __dirname,
        '../quizzy-315010-a425668eaab0.json',
    ),
    projectId: process.env.PROJECT_ID,
})

const bucket = googleCloud.bucket('quizzy-images')

router.post('/upload', upload, (req, res) => {
    if (!req.file) {
        res.json({ error: 'No file uploaded' })
        return
    }

    const splittedFile = req.file.originalname.split('.')
    const extenstion = splittedFile[splittedFile.length - 1]
    const newFilename = `${uuidv4()}.${extenstion}`

    const blob = bucket.file(newFilename)
    const blobStream = blob.createWriteStream()

    blobStream.on('error', err => {
        console.log(err)
        res.json({ error: err })
    })

    blobStream.on('finish', () => {
        const publicURL = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
        )
        res.json(publicURL)
    })

    blobStream.end(req.file.buffer)
})

module.exports = router
