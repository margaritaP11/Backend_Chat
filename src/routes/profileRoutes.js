import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  getUserProfile,
  updateUserProfile,
  updateAvatar,
  deleteUser,
  deleteAvatar,
} from '../controllers/profileController.js'

import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

// Получить свой профиль
router.get('/me', authMiddleware, getUserProfile)

// Обновить свой профиль
router.put('/me', authMiddleware, updateUserProfile)

// Обновить аватар
router.put('/avatar', authMiddleware, upload.single('avatar'), updateAvatar)

// Удалить аватар
router.delete('/avatar', authMiddleware, deleteAvatar)

// Получить профиль по ID (должно быть ниже avatar!)
router.get('/:id', getUserProfile)

// Удалить пользователя по ID (тоже ниже avatar!)
router.delete('/:id', deleteUser)

export default router
