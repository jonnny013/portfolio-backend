import { Request, response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user'

const getTokenFrom = (request: Request): string | null => {
  
  if ('get' in request && request.get('authorization') !== undefined) {
    const authorization: string | undefined = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    } else {
      return null
    }
  }

  return null
}

const tokenCheck = async (request: Request) => {
  const token = getTokenFrom(request)

  if (token === null) {
    return response.status(401).json({ error: 'Token not provided' })
  }

  const secret = process.env.SECRET

  if (!secret) {
    return response
      .status(500)
      .json({ error: 'Internal server error: JWT secret not configured' })
  }

  const decodedToken = jwt.verify(token, secret) as { id?: string }

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(401).json({ error: 'Token invalid' })
  }
  return 'Token authenticated'
}

export default tokenCheck
