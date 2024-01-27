import mongoose from 'mongoose'

const visitRecordSchema = new mongoose.Schema(
  {
    time: { type: Date }, 
    device: String,
    visitedPaths: String,
  },
  { _id: false, versionKey: false }
)

const visitorRecordSchema = new mongoose.Schema({
  ipAddress: String,
  visitRecord: [{
    type: visitRecordSchema,
  }],
  visits: Number
})

visitorRecordSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const VisitorRecord = mongoose.model('VisitorRecord', visitorRecordSchema)

export default VisitorRecord
