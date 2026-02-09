const onlineUsers = new Map()

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join', (userId) => {
      socket.join(userId)
      onlineUsers.set(userId, socket.id)

      io.emit('online_users', Array.from(onlineUsers.keys()))
    })

    socket.on('send_message', ({ sender, receiver, text }) => {
      io.to(receiver).emit('receive_message', { sender, text })

      io.to(receiver).emit('receive_notification', {
        type: 'message',
        fromUser: sender,
        text,
      })
    })

    socket.on('send_notification', ({ userId, notification }) => {
      io.to(userId).emit('receive_notification', notification)
    })

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
