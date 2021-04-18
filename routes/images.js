const router = require('express').Router()
const upload = require('../middlewares/upload')
const path = require('path')

router.get('/thumbnail', (req, res) => {
    const { thumbnail } = req.query
    res.sendFile(path.resolve(`public/images/${thumbnail}`))
})

router.post('/upload', upload, (req, res) => {
    res.json(req.file.filename)
})

module.exports = router
