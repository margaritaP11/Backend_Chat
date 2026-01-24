import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  sendMessage,
  getMessages,
  getDialogs,
} from '../controllers/messageController.js'

const router = express.Router()

// 📌 Список всех диалогов (как в Instagram)
router.get('/', authMiddleware, getDialogs)

// 📌 История сообщений с конкретным пользователем
router.get('/:userId', authMiddleware, getMessages)

// 📌 Отправка сообщения
router.post('/', authMiddleware, sendMessage)

export default router
