import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  sendMessage,
  getMessages,
  getDialogs,
  getUnreadCounts,
  deleteDialog,
} from '../controllers/messageController.js'

const router = express.Router()

// список діалогів
router.get('/', authMiddleware, getDialogs)

// лічильники unread
router.get('/unread-counts', authMiddleware, getUnreadCounts)

// видалення діалогу
router.delete('/dialog/:id', authMiddleware, deleteDialog)

// повідомлення з конкретним користувачем
router.get('/:userId', authMiddleware, getMessages)

// відправка повідомлення
router.post('/', authMiddleware, sendMessage)

export default router
