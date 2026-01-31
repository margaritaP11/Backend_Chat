import Comment from '../models/commentModel.js'

// ➤ Добавить комментарий
export const addComment = async (req, res) => {
  try {
    const userId = req.user
    const postId = req.params.id
    const { text } = req.body

    const comment = await Comment.create({
      text,
      user: userId,
      post: postId,
    })

    const populated = await comment.populate('user', 'name avatar')

    res.json(populated)
  } catch (error) {
    console.error('COMMENT ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ➤ Получить комментарии
export const getComments = async (req, res) => {
  try {
    const postId = req.params.id

    const comments = await Comment.find({ post: postId })
      .populate('user', 'name avatar')
      .sort({ createdAt: 1 })

    res.json(comments)
  } catch (error) {
    console.error('GET COMMENTS ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ➤ Лайк комментария
export const toggleCommentLike = async (req, res) => {
  try {
    const userId = req.user
    const commentId = req.params.id

    const comment = await Comment.findById(commentId)
    if (!comment) return res.status(404).json({ message: 'Comment not found' })

    const already = comment.likes.includes(userId)

    if (already) {
      comment.likes.pull(userId)
      await comment.save()
      return res.json({ liked: false, likes: comment.likes.length })
    }

    comment.likes.push(userId)
    await comment.save()

    res.json({ liked: true, likes: comment.likes.length })
  } catch (error) {
    console.error('COMMENT LIKE ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ➤ Удалить комментарий
export const deleteComment = async (req, res) => {
  try {
    const userId = req.user
    const commentId = req.params.id

    const comment = await Comment.findById(commentId)
    if (!comment) return res.status(404).json({ message: 'Comment not found' })

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not allowed' })
    }

    await comment.deleteOne()

    res.json({ message: 'Comment deleted' })
  } catch (error) {
    console.error('DELETE COMMENT ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
