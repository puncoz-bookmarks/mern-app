import express from 'express'

declare global {
  namespace Express {
    interface Request {
      user?: object
      [prop: string]: any
    }
  }
}
