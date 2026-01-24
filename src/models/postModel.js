import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    image: { type: String, default: '' }, // Base64
  },
  { timestamps: true },
)

const Post = mongoose.model('Post', postSchema)
export default Post
