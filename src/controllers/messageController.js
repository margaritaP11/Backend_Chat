import mongoose from 'mongoose'
import Message from '../models/messageModel.js'
import User from '../models/userModel.js'
import Notification from '../models/notificationModel.js'

export const sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body
    const sender = req.user.id

    const receiverExists = await User.findById(receiver)
    if (!receiverExists) {
      return res.status(404).json({ message: 'Receiver not found' })
    }

    const message = await Message.create({ sender, receiver, text })

    await Notification.create({
      user: receiver,
      fromUser: sender,
      type: 'message',
      message: text,
    })

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

export const getDialogs = async (req, res) => {
  try {
    const myId = new mongoose.Types.ObjectId(req.user.id)

    const dialogs = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: myId }, { receiver: myId }],
        },
      },
      { $sort: { createdAt: -1 } },
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

    const populated = await Promise.all(
      dialogs.map(async (d) => {
        const user = await User.findById(d._id).select('username avatar')
        return {
          _id: d._id,
          lastMessage: d.lastMessage,
          lastTime: d.lastTime,
          user,
        }
      }),
    )

    res.json(populated)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
