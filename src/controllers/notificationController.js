import Notification from '../models/notificationModel.js'

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('fromUser', 'username fullName avatar')
      .populate('post', 'image')

    res.json(notifications)
  } catch (error) {
    console.error('GET NOTIFICATIONS ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const markAsRead = async (req, res) => {
  try {
    const userId = req.user

    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true },
    )

    res.json({ message: 'Notifications marked as read' })
  } catch (error) {
    console.error('MARK READ ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
