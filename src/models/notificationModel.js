import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // кому уведомление
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // кто вызвал уведомление
    type: {
      type: String,
      enum: ['like', 'comment', 'follow', 'message'],
      required: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // для лайков/комментов
    text: { type: String }, // текст уведомления
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.model('Notification', notificationSchema)
