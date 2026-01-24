import Post from '../models/postModel.js'

export const getExplorePosts = async (req, res) => {
  try {
    const posts = await Post.aggregate([{ $sample: { size: 50 } }])
    res.json(posts)
  } catch (error) {
    console.error('EXPLORE ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
