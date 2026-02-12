import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  getMyProfile,
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  updateAvatar,
  deleteAvatar,
} from '../controllers/profileController.js'

import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/me', authMiddleware, getMyProfile)
router.post('/me', authMiddleware, createUserProfile)
router.put('/me', authMiddleware, updateUserProfile)

router.put('/avatar', authMiddleware, upload.single('avatar'), updateAvatar)
router.delete('/avatar', authMiddleware, deleteAvatar)

router.get('/:id', getUserProfile)

export default router
