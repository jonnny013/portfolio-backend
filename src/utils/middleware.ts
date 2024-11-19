import type { NextFunction, Request, Response } from 'npm:express'
import logger from './logger.ts'
import visitorInfoService from '../services/visitorInfoService.ts'
import jwt from 'npm:jsonwebtoken'
import config from '../config/config.ts'
import process from "node:process";

const tokenCheck = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      if (!config.SECRET) {
        res.status(500).json({ error: 'Internal server error' })
        return
      }
      req.decodedToken = jwt.verify(authorization.substring(7), config.SECRET)
    } catch {
      res.status(401).json({ error: 'token invalid' })
      return
    }
  } else {
    res.status(401).json({ error: 'token missing' })
    return
  }
  next()
  return
}

const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  process.env.NODE_ENV !== 'test' &&
    visitorInfoService.addVisitor(request).catch(error => {
      logger.error('Error in addVisitor:', error)
    })
  logger.info('Method: ', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body)
  response.on('finish', () => {
    logger.info('Status:', response.statusCode)
    logger.info('---')
  })
  logger.info('---')
  logger.info(
    'User IP: ',
    (request.headers['x-forwarded-for'] || request.connection.remoteAddress || '')
      .toString()
      .split(',')[0]
      .trim(),
    'user agent: ',
    request.get('User-Agent')
  )
  next()
}

const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (
  error: { message: unknown; name: string },
  _request: Request,
  response: Response,
  next: NextFunction
) => {
  logger.error(error.message)

  if (error.name === 'CastError' && error instanceof Error) {
    response.status(400).send({ error: 'malformatted id' })
    return
  } else if (error.name === 'ValidationError' && error instanceof Error) {
    response.status(400).json({ error: error.message })
    return
  } else if (error.name === 'TokenExpiredError') {
    response.status(401).json({
      error: 'token expired',
    })
    return
  }

  return next(error)
}

export default { errorHandler, requestLogger, unknownEndpoint, tokenCheck }
