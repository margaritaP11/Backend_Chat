import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { addComment, getComments } from '../controllers/commentController.js'

const router = express.Router()

router.post('/:id', authMiddleware, addComment)
router.get('/:id', getComments)

export default router
