const onlineUsers = new Map()

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // Пользователь присоединяется к своей комнате
    socket.on('join', (userId) => {
      socket.join(userId)
      onlineUsers.set(userId, socket.id)

      // Обновляем список онлайн-пользователей
      io.emit('online_users', Array.from(onlineUsers.keys()))
    })

    // 📌 Отправка сообщения
    socket.on('send_message', ({ sender, receiver, text }) => {
      io.to(receiver).emit('receive_message', { sender, text })

      // Real-time уведомление о сообщении
      io.to(receiver).emit('receive_notification', {
        type: 'message',
        fromUser: sender,
        text,
      })
    })

    // 📌 Универсальное событие для уведомлений (лайки, подписки, комментарии)
    socket.on('send_notification', ({ userId, notification }) => {
      io.to(userId).emit('receive_notification', notification)
    })

    // 📌 Отключение пользователя
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)

      // Удаляем пользователя из списка онлайн
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId)
          break
        }
      }

      // Обновляем список онлайн-пользователей
      io.emit('online_users', Array.from(onlineUsers.keys()))
    })
  })
}
