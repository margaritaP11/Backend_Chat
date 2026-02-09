import express from 'express'
import User from '../models/userModel.js'
import Notification from '../models/notificationModel.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

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

router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate('fromUser', 'username avatar')
      .populate('post', 'image _id')
      .sort({ createdAt: -1 })

    res.json(notifications)
  } catch (err) {
    console.error('NOTIFICATIONS ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/notifications/:id', authMiddleware, async (req, res) => {
  try {
    await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    res.json({ success: true })
  } catch (err) {
    console.error('DELETE NOTIFICATION ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
