import mongoose from 'mongoose'
import Message from '../models/messageModel.js'
import User from '../models/userModel.js'
import Notification from '../models/notificationModel.js'

/* SEND MESSAGE */
export const sendMessage = async (req, res) => {
  try {
    const { receiver, text } = req.body
    const sender = req.user.id

    const receiverExists = await User.findById(receiver)
    if (!receiverExists) {
      return res.status(404).json({ message: 'Receiver not found' })
    }

    const message = await Message.create({
      sender,
      receiver,
      text,
      unread: true,
    })

    await Notification.create({
      user: receiver,
      fromUser: sender,
      type: 'message',
      text,
      isRead: false,
    })

    // ⭐ SOCKET
    req.io.to(receiver.toString()).emit('receive_message', {
      sender,
      receiver,
      text,
    })

    res.json(message)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* GET MESSAGES WITH USER */
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params
    const myId = req.user.id

    await Message.updateMany(
      { sender: userId, receiver: myId, unread: true },
      { $set: { unread: false } },
    )

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

/* GET DIALOG LIST */
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

        const unread = await Message.countDocuments({
          sender: d._id,
          receiver: myId,
          unread: true,
        })

        return {
          _id: d._id,
          lastMessage: d.lastMessage,
          lastTime: d.lastTime,
          user,
          unread,
        }
      }),
    )

    res.json(populated)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* GET TOTAL UNREAD COUNTS */
export const getUnreadCounts = async (req, res) => {
  try {
    const userId = req.user.id

    const unreadMessages = await Message.countDocuments({
      receiver: userId,
      unread: true,
    })

    const unreadNotifications = await Notification.countDocuments({
      user: userId,
      isRead: false,
    })

    res.json({
      messages: unreadMessages,
      notifications: unreadNotifications,
    })
  } catch (error) {
    console.error('UNREAD COUNTS ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* DELETE DIALOG */
export const deleteDialog = async (req, res) => {
  try {
    const myId = req.user.id
    const otherId = req.params.id

    await Message.deleteMany({
      $or: [
        { sender: myId, receiver: otherId },
        { sender: otherId, receiver: myId },
      ],
    })

    res.json({ message: 'Dialog deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}
