import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { toggleLike } from '../controllers/likeController.js'

const router = express.Router()

router.post('/:id', authMiddleware, toggleLike)
router.get('/status/:id', authMiddleware, async (req, res) => {
  const userId = req.user
  const postId = req.params.id

  const existing = await Like.findOne({ user: userId, post: postId })
  const likesCount = await Like.countDocuments({ post: postId })

  res.json({
    liked: !!existing,
    likesCount,
  })
})

export default router
