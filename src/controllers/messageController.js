import Message from '../models/messageModel.js'
import User from '../models/userModel.js'
import Notification from '../models/notificationModel.js'

// Отправка сообщения
export const sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body
    const sender = req.user.id

    // Проверяем, существует ли получатель
    const receiverExists = await User.findById(receiver)
    if (!receiverExists) {
      return res.status(404).json({ message: 'Receiver not found' })
    }

    // Создаём сообщение
    const message = await Message.create({ sender, receiver, text })

    // Создаём уведомление
    await Notification.create({
      user: receiver, // кому уведомление
      fromUser: sender, // кто отправил
      type: 'message',
      message: text,
    })

    // Real-time уведомление
    req.io.to(receiver.toString()).emit('receive_notification', {
      type: 'message',
      fromUser: sender,
      text,
    })

    // Real-time сообщение
    req.io.to(receiver.toString()).emit('receive_message', {
      sender,
      text,
    })

    res.json(message)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// История сообщений между двумя пользователями
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params
    const myId = req.user.id

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId },
      ],
    }).sort({ createdAt: 1 })

    res.json(messages)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Список диалогов (как в Instagram)
export const getDialogs = async (req, res) => {
  try {
    const myId = req.user.id

    const dialogs = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: myId }, { receiver: myId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$sender', myId] }, '$receiver', '$sender'],
          },
          lastMessage: { $first: '$text' },
          lastTime: { $first: '$createdAt' },
        },
      },
    ])

    res.json(dialogs)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
