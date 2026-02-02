import express from 'express'
import multer from 'multer'
import { authMiddleware } from '../middlewares/authMiddleware.js'

import {
  createPost,
  getUserPosts,
  deletePost,
  getPostById,
  updatePost,
  getAllPosts,
  getFeedPosts,
  addComment, // ← ДОДАНО
} from '../controllers/postController.js'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
})

router.post('/', authMiddleware, upload.single('image'), createPost)

router.get('/feed', authMiddleware, getFeedPosts)

router.get('/user/:id', getUserPosts)

router.get('/', authMiddleware, getAllPosts)

router.get('/:id', getPostById)

router.put('/:id', authMiddleware, upload.single('image'), updatePost)

router.delete('/:id', authMiddleware, deletePost)

router.post('/:id/comment', authMiddleware, addComment) // ← ТЕПЕР ПРАЦЮЄ

export default router
