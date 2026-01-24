import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/uploadMiddleware.js'
import {
  createPost,
  getUserPosts,
  deletePost,
  getPostById,
  updatePost,
  getAllPosts,
} from '../controllers/postController.js'

const router = express.Router()

// Создать пост с изображением
router.post('/', authMiddleware, upload.single('image'), createPost)

// Получить все посты (лента новостей)
router.get('/', getAllPosts)

// Получить все посты конкретного пользователя
router.get('/user/:id', getUserPosts)

// Обновить пост
router.put('/:id', authMiddleware, upload.single('image'), updatePost)

// Удалить пост
router.delete('/:id', authMiddleware, deletePost)

// Получить конкретный пост по ID
router.get('/:id', getPostById)

export default router
