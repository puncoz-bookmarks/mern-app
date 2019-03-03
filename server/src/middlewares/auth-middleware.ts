import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import UnauthorizedError from '../errors/unauthorized-error'

const dontAuthenticatePaths: string[] = [
  '/api/auth/register',
  '/api/auth/login',
]

const getTokenFromHeader = (request: Request): string => {
  const bearerToken = request.header('Authorization')

  if (!bearerToken) {
    throw new UnauthorizedError('Authorization header is missing')
  }

  const token = bearerToken.split(' ')[1]

  if (!token) {
    throw new UnauthorizedError(
      'Token is not sent in correct format. Please use the format: Bearer token'
    )
  }

  return token
}

export const authMiddleware = (
  request: Request,
  _: Response,
  next: NextFunction
): void => {
  if (dontAuthenticatePaths.includes(request.path)) {
    return next()
  }

  try {
    const payload = jwt.verify(
      getTokenFromHeader(request),
      process.env.JWT_SECRET
    ) as object

    request.user = payload

    next()
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return next(error)
    }

    if (error.name && error.name === 'TokenExpiredError') {
      error = new UnauthorizedError(
        'Your token has expired. Please login again'
      )
    } else {
      error = new UnauthorizedError('Token is invalid')
    }

    return next(error)
  }
}
