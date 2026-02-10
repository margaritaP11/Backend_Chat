import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    // кому уведомление
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // кто вызвал уведомление
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // тип уведомления
    type: {
      type: String,
      enum: ['like', 'comment', 'follow', 'message'],
      required: true,
    },

    // пост, если уведомление связано с постом
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },

    // текст уведомления (например: "liked your post")
    text: {
      type: String,
    },

    // прочитано или нет
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Notification', notificationSchema)
