const app = require('express')()
const dotenv = require('dotenv')
const bodyParser = require('body-parser').json()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const passport = require('passport')

// config
const { port } = require('./config')

// Routes
const authRoute = require('./routes/auth')

dotenv.config()

// DB Connection
require('./db/connect')

// Passport config
// require('./authentication/passport')(passport)

const store = new MongoDBStore({
    uri: process.env.DB_URI,
    databaseName: 'quizzy',
    collection: 'sessions',
})

store.on('error', err => {
    console.log(err)
})

// Middlewares
app.use(bodyParser)
app.use(cookieParser())
app.use(
    cors({
        credentials: true,
    }),
)
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
        store: store,
        resave: true,
        saveUninitialized: true,
    }),
)
// app.use(passport.initialize())
// app.use(passport.session())

// Route Middlewares
app.use('/api/users', authRoute)

app.listen(port, () => console.log('running'))
