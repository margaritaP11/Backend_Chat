import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  addComment,
  getComments,
  toggleCommentLike,
  deleteComment,
} from '../controllers/commentController.js'

const router = express.Router()

router.post('/:id', authMiddleware, addComment)
router.get('/:id', getComments)
router.post('/like/:id', authMiddleware, toggleCommentLike)
router.delete('/:id', authMiddleware, deleteComment)

export default router
