import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from '../controllers/followController.js'

const router = express.Router()

// Подписаться
router.post('/follow/:userId', authMiddleware, followUser)

// Отписаться
router.delete('/unfollow/:userId', authMiddleware, unfollowUser)

// Получить подписчиков
router.get('/followers/:userId', authMiddleware, getFollowers)

// Получить подписки
router.get('/following/:userId', authMiddleware, getFollowing)

export default router
