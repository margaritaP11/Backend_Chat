import Like from '../models/likeModel.js'
import Post from '../models/postModel.js'
import Notification from '../models/notificationModel.js'

export const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id
    const postId = req.params.id

    const post = await Post.findById(postId)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    const existing = await Like.findOne({ user: userId, post: postId })

    if (existing) {
      await existing.deleteOne()
    } else {
      await Like.create({ user: userId, post: postId })

      // 🔥 УВЕДОМЛЕНИЕ О ЛАЙКЕ
      if (post.user.toString() !== userId.toString()) {
        await Notification.create({
          user: post.user, // кому уведомление
          fromUser: userId, // кто лайкнул
          type: 'like',
          post: postId,
          text: 'liked your post',
        })
      }
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
