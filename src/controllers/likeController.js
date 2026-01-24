import Like from '../models/likeModel.js'
import Post from '../models/postModel.js'
import Notification from '../models/notificationModel.js'

export const toggleLike = async (req, res) => {
  try {
    const userId = req.user
    const postId = req.params.id

    // Находим пост
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' })
    }

    // Проверяем, лайкал ли уже
    const existing = await Like.findOne({ user: userId, post: postId })

    if (existing) {
      await existing.deleteOne()
      return res.json({ liked: false, message: 'Like removed' })
    }

    // Создаём лайк
    await Like.create({ user: userId, post: postId })

    // Создаём уведомление
    await Notification.create({
      user: post.owner, // кому уведомление
      fromUser: userId, // кто лайкнул
      type: 'like',
      post: post._id,
      message: 'Ваш пост понравился',
    })

    // Real-time уведомление
    req.io.to(post.owner.toString()).emit('receive_notification', {
      type: 'like',
      fromUser: userId,
      postId: post._id,
      message: 'Ваш пост понравился',
    })

    res.json({ liked: true, message: 'Post liked' })
  } catch (error) {
    console.error('LIKE ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
