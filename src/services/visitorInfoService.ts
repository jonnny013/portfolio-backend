import type { Request } from 'npm:express'
import VisitorRecord from "../modelsMongoose/visitorInfo.ts"
import logger from "../utils/logger.ts"

const getVisitor = async () => {
  const project = await VisitorRecord.find({})
  return project
}

const addVisitor = async (request: Request) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ipAddress: string = (
      request.headers['x-forwarded-for'] ||
      request.connection.remoteAddress ||
      ''
    )
      .toString()
      .split(',')[0]
      .trim()
    const ipAlreadyVisited = await VisitorRecord.findOne({ ipAddress })
    if (ipAlreadyVisited) {
      const newVisitRecord = {
        time: new Date().toString(),
        device: request.get('User-Agent'),
        visitedPaths: request.path,
      }
      await VisitorRecord.findByIdAndUpdate(ipAlreadyVisited._id, {
        $push: { visitRecord: newVisitRecord },
        $inc: { visits: 1 },
      })
    } else {
      const newVisitRecord = new VisitorRecord({
        ipAddress: ipAddress,
        visitRecord: {
          time: new Date().toString(),
          device: request.get('User-Agent'),
          visitedPaths: request.path,
        },
        visits: 1,
      })
      await newVisitRecord.save()
    }
  } catch (error) {
    logger.error(error)
  }
}

export default { addVisitor, getVisitor }
