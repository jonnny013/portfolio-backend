import multer from 'multer'
// import path from 'path'

// const storage = multer.diskStorage({
//   destination: function (_req, _res, cb) {
//     cb(null, './public/images')
//   },
//   filename: function (_req, file, cb) {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
//     cb(null, Date.now() + path.extname(file.originalname))
//   },
// })

const storage = multer.memoryStorage()
export const upload = multer({
  storage: storage,
})
