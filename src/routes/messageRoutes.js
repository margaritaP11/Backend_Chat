import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  sendMessage,
  getMessages,
  getDialogs,
} from '../controllers/messageController.js'

const router = express.Router()

router.get('/', authMiddleware, getDialogs)

router.get('/:userId', authMiddleware, getMessages)

router.post('/', authMiddleware, sendMessage)

export default router
