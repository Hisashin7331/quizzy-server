const router = require('express').Router()
const upload = require('../middlewares/upload')
const path = require('path')

router.get('/', (req, res) => {
    const { image } = req.query
    res.sendFile(path.resolve(`public/images/${image}`))
})

router.post('/upload', upload, (req, res) => {
    res.json(req.file.filename)
})

module.exports = router
