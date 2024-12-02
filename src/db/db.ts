import { Sequelize } from 'npm:sequelize'
import logger from '../utils/logger.ts'
import process from 'node:process'

const databaseUrl = Deno.env.get('DATABASE_URL')
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set')
}
export const sequelize = new Sequelize(databaseUrl)

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    logger.info('Database connected successfully')
  } catch (error) {
    logger.error('Database connection error:', error)
    process.exit(1)
  }
}
