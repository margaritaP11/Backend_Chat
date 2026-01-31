import Like from '../models/likeModel.js'
import Post from '../models/postModel.js'
import Notification from '../models/notificationModel.js'

export const toggleLike = async (req, res) => {
  try {
    const userId = req.user
    const postId = req.params.id

    const existing = await Like.findOne({ user: userId, post: postId })

    if (existing) {
      await existing.deleteOne()
    } else {
      await Like.create({ user: userId, post: postId })
    }

    const likesCount = await Like.countDocuments({ post: postId })

    res.json({
      liked: !existing,
      likesCount,
    })
  } catch (error) {
    console.error('LIKE ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
