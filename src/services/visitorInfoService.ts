import { Request } from 'express'
import VisitorRecord from '../models/visitorInfo'
import logger from '../utils/logger'

const getVisitor = async () => {
  const project = await VisitorRecord.find({})
  return project
}

const addVisitor = async (request: Request) => {
  try {
    const ipAddress = request.ip
    const ipAlreadyVisited = await VisitorRecord.findOne({ ipAddress })
    if (ipAlreadyVisited) {
      const newVisitRecord = {
        time: new Date().toString(),
        device: request.get('User-Agent'),
        vistedPaths: request.path,
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
          vistedPaths: request.path,
        },
        visits: 1
      })
      await newVisitRecord.save()
    }
  } catch (error) {
    logger.error(error)
  }
}

export default { addVisitor, getVisitor }
