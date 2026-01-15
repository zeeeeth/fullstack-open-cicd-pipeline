const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const app = express()


mongoose.set('strictQuery', false)

console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('MONGODB_URI:', config.MONGODB_URI)


if (!config.NO_DB) {
  mongoose
    .connect(config.MONGODB_URI, { family: 4 })
    .then(() => {
      logger.info('Connected to MongoDB')
    })
    .catch((error) => {
      logger.error('Error connecting to MongoDB:', error.message)
      logger.info('Continuing without database (NO_DB mode)')
    })
} else {
  logger.info('NO_DB=true, skipping MongoDB connection')
}


app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

const dbReady = () => mongoose.connection.readyState === 1

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: dbReady() ? 'up-or-disabled' : 'down' })
})

app.use('/api/blogs', (req, res, next) => {
  if (!dbReady()) return res.status(503).json({ error: 'database unavailable' })
  next()
}, middleware.userExtractor, blogsRouter)

app.use('/api/users', (req, res, next) => {
  if (!dbReady()) return res.status(503).json({ error: 'database unavailable' })
  next()
}, usersRouter)

app.use('/api/login', (req, res, next) => {
  if (!dbReady()) return res.status(503).json({ error: 'database unavailable' })
  next()
}, loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app