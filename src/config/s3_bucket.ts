import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import type { Express } from 'express'
import logger from '../utils/logger.js'
import crypto from 'node:crypto'
import path from 'node:path'
import process from 'node:process'

const bucketName = process.env.BUCKET_NAME as string
const bucketRegion = process.env.BUCKET_REGION as string
const awsSecretKey = process.env.AWS_SECRET_KEY as string
const awsAccessKey = process.env.AWS_ACCESS_KEY as string

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey,
  },
})

export const randomFileName = (bytes = 10) => crypto.randomBytes(bytes).toString('hex')

export const saveToS3 = async (
  file: Express.Multer.File,
  fileName: string,
  mimetype: string,
) => {
  try {
    const randomName = randomFileName()
    const fileExtension = path.extname(fileName)
    const fileNameWithRandom = fileName.replace(
      fileExtension,
      `-${randomName}${fileExtension}`,
    )
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileNameWithRandom,
      Body: file.buffer,
      ContentType: mimetype,
    })
    await s3.send(command)
    logger.info('Successfully saved to S3')
    return fileNameWithRandom
  } catch (error) {
    logger.error('Error saving to S3:', error)
    throw new Error('Error saving to S3')
  }
}

export const deleteFromS3 = async (fileName: string) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    }
    const command = new DeleteObjectCommand(params)
    await s3.send(command)
    logger.info('Successfully deleted from S3')
  } catch (error) {
    logger.error('Error deleting from S3:', error)
    throw new Error('Error deleting from S3')
  }
}

export const getImageFromS3 = (fileName: string) => {
  return `https://d2tgooe9ddez9l.cloudfront.net/${fileName}`
}
