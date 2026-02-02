import express from 'express'
import User from '../models/userModel.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

// SEARCH USERS
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const query = req.query.q || ''

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
      ],
    }).select('username name avatar')

    res.json(users)
  } catch (err) {
    console.error('SEARCH USERS ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
