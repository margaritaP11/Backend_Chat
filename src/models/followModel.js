import mongoose from 'mongoose'

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }, // кто подписался
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }, // на кого подписались
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Follow', followSchema)
