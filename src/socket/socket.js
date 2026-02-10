import Message from '../models/messageModel.js'
import Notification from '../models/notificationModel.js'

const onlineUsers = new Map()

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // JOIN
    socket.on('join', (userId) => {
      socket.join(userId)
      onlineUsers.set(userId, socket.id)
      io.emit('online_users', Array.from(onlineUsers.keys()))
    })

    // SEND MESSAGE
    socket.on('send_message', async ({ sender, receiver, text }) => {
      try {
        const msg = await Message.create({
          sender,
          receiver,
          text,
          unread: true,
        })

        const notif = await Notification.create({
          user: receiver,
          fromUser: sender,
          type: 'message',
          text,
          isRead: false,
        })

        io.to(receiver).emit('receive_message', msg)
        io.to(receiver).emit('receive_notification', notif)

        const unreadMessages = await Message.countDocuments({
          receiver,
          unread: true,
        })

        const unreadNotifications = await Notification.countDocuments({
          user: receiver,
          isRead: false,
        })

        io.to(receiver).emit('update_unread_counts', {
          messages: unreadMessages,
          notifications: unreadNotifications,
        })
      } catch (err) {
        console.error('SEND_MESSAGE SOCKET ERROR:', err)
      }
    })

    // MARK MESSAGES READ
    socket.on('mark_messages_read', async ({ userId, otherUserId }) => {
      try {
        await Message.updateMany(
          { sender: otherUserId, receiver: userId, unread: true },
          { $set: { unread: false } },
        )

        const unreadMessages = await Message.countDocuments({
          receiver: userId,
          unread: true,
        })

        io.to(userId).emit('update_unread_counts', {
          messages: unreadMessages,
        })
      } catch (err) {
        console.error('MARK_MESSAGES_READ ERROR:', err)
      }
    })

    // MARK NOTIFICATIONS READ
    socket.on('mark_notifications_read', async (userId) => {
      try {
        await Notification.updateMany(
          { user: userId, isRead: false },
          { $set: { isRead: true } },
        )

        const unreadNotifications = await Notification.countDocuments({
          user: userId,
          isRead: false,
        })

        io.to(userId).emit('update_unread_counts', {
          notifications: unreadNotifications,
        })
      } catch (err) {
        console.error('MARK_NOTIFICATIONS_READ ERROR:', err)
      }
    })

    // DISCONNECT
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)

      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId)
          break
        }
      }

      io.emit('online_users', Array.from(onlineUsers.keys()))
    })
  })
}
