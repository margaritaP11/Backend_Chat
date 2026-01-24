import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  getNotifications,
  markAsRead,
} from '../controllers/notificationController.js'

const router = express.Router()

// Получить уведомления
router.get('/', authMiddleware, getNotifications)

// Пометить как прочитанные
router.put('/read', authMiddleware, markAsRead)

export default router
