import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import logger from "../utils/logger"

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

export const saveToS3 = async (file: Buffer | File, fileName: string, mimetype: string) => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body:file,
      ContentType: mimetype,
    })
    await s3.send(command)
    logger.info("Successfully saved to S3")
  } catch (error) {
    logger.error("Error saving to S3:", error)
  }
}
