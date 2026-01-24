import multer from 'multer'

// Храним файл в оперативной памяти
const storage = multer.memoryStorage()

// Ограничения (по желанию)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Можно загружать только изображения'), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 5MB
})
