import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  getMyProfile,
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  updateAvatar,
  deleteAvatar,
  deleteUser,
} from '../controllers/profileController.js'

import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

// ⭐ Отримати свій профіль
router.get('/me', authMiddleware, getMyProfile)

// ⭐ Створити профіль
router.post('/me', authMiddleware, createUserProfile)

// ⭐ Оновити текстову інформацію профілю
router.put('/me', authMiddleware, updateUserProfile)

// ⭐ Оновити аватар (ВАЖЛИВО: upload.single('avatar'))
router.put('/avatar', authMiddleware, upload.single('avatar'), updateAvatar)

// ⭐ Видалити аватар
router.delete('/avatar', authMiddleware, deleteAvatar)

// ⭐ Отримати профіль іншого користувача
router.get('/:id', getUserProfile)

// ⭐ Видалити користувача
router.delete('/:id', deleteUser)

export default router
