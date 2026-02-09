import multer from 'multer'

//  фото в base64
const storage = multer.memoryStorage()

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
})
