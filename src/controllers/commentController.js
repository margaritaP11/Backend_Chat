import Comment from '../models/commentModel.js'

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

    res.json({ message: 'Comment added', comment })
  } catch (error) {
    console.error('COMMENT ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
export const getComments = async (req, res) => {
  try {
    const postId = req.params.id

    const comments = await Comment.find({ post: postId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })

    res.json(comments)
  } catch (error) {
    console.error('GET COMMENTS ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
