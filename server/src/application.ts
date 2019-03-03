import express, { Application } from 'express'
import routes from './routes'
import logger from './logger/logger'
import errorHandler from './middlewares/error-handler'
import appMiddleware from './middlewares/app-middleware'
import databaseConnector from './database/database-connector'

class MERNApplication {
  static create(): MERNApplication {
    const mernApp = new MERNApplication()
    mernApp.registerMiddlewares()
    mernApp.connectDatabase()
    mernApp.registerRoutes()
    mernApp.handleErrors()

    return mernApp
  }

  private app: Application

  private constructor() {
    this.app = express()
  }

  async listen(port: number): Promise<any> {
    try {
      await this.app.listen(port)
    } catch (err) {
      logger.info(`Server started listening on http://localhost:${port}`)
    }
  }

  private registerRoutes(): void {
    this.app.use('/api', routes)
  }

  private handleErrors(): void {
    errorHandler.handle(this.app)
  }

  private registerMiddlewares(): void {
    appMiddleware.register(this.app)
  }

  private connectDatabase(): void {
    databaseConnector.connect()
  }
}

export default MERNApplication
