import multer from 'multer'

// ⭐ Пам'ять, бо ми зберігаємо фото в base64
const storage = multer.memoryStorage()

// ⭐ Ліміт 20MB, щоб не було MulterError: File too large
export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
})
