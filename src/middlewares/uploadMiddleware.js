import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

// Правильний __dirname для ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Абсолютний шлях до src/uploads
const uploadsPath = path.join(__dirname, '../uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext
    cb(null, uniqueName)
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
})
