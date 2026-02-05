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
  addComment,
} from '../controllers/postController.js'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
})

// CREATE POST
router.post('/', authMiddleware, upload.single('image'), createPost)

// FEED
router.get('/feed', authMiddleware, getFeedPosts)

// USER POSTS — ВИПРАВЛЕНО
router.get('/user/:id', authMiddleware, getUserPosts)

// ALL POSTS
router.get('/', authMiddleware, getAllPosts)

// GET POST BY ID
router.get('/:id', authMiddleware, getPostById)

// UPDATE POST
router.put('/:id', authMiddleware, upload.single('image'), updatePost)

// DELETE POST
router.delete('/:id', authMiddleware, deletePost)

// ADD COMMENT
router.post('/:id/comment', authMiddleware, addComment)

export default router
