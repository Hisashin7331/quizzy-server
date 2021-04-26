const mongoose = require('mongoose')

mongoose.connect(
    process.env.DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
    () => console.log('DB Connected...'),
)
