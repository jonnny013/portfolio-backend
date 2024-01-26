import { NextFunction, Request, Response } from 'express'
import logger from './logger'

const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  logger.info('Method: ', request.method)
  logger.info('Path: ', request.path)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  logger.info('Body: ', request.body)
  response.on('finish', () => {
    logger.info('Status:', response.statusCode)
    logger.info('---')
  })
  logger.info('---')
  logger.info('User IP: ', request.ip,  request.connection.remoteAddress, 'user agent: ', request.get('User-Agent'))
  next()
}

const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error: { message: unknown; name: string }, _request: Request, response: Response, next: NextFunction) => {
  logger.error(error.message)

  if (error.name === 'CastError' && error instanceof Error) {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError' && error instanceof Error) {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    })
  }

  return next(error)
}

export default { errorHandler, requestLogger, unknownEndpoint}