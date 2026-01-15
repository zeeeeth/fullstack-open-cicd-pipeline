const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.method)
    logger.info('Body:  ', request.method)
    logger.info('---', request.method)
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {    
        return response.status(400).json({ error: 'expected `username` to be unique' })  
    } else if (error.name ===  'JsonWebTokenError') {    
        return response.status(401).json({ error: 'token invalid' })  
    } else if (error.name === 'TokenExpiredError') {    
        return response.status(401).json({ error: 'token expired' })  
    }
    next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }

  next()
}

const userExtractor = async (request, response, next) => {
    if (!request.token) {
        request.user = null
        return next()
    }

    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        request.user = await User.findById(decodedToken.id)
    } catch (error) {
        request.user = null
    }

    next()
}

module.exports = {
    tokenExtractor,
    requestLogger,
    unknownEndpoint,
    userExtractor,
    errorHandler
}