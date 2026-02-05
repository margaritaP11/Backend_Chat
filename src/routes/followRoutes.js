import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollow,
} from '../controllers/followController.js'

const router = express.Router()

router.post('/follow/:userId', authMiddleware, followUser)
router.delete('/unfollow/:userId', authMiddleware, unfollowUser)

router.get('/followers/:userId', authMiddleware, getFollowers)
router.get('/following/:userId', authMiddleware, getFollowing)

router.get('/check/:userId', authMiddleware, checkFollow)

export default router
