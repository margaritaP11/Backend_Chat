import Follow from '../models/followModel.js'
import User from '../models/userModel.js'
import Notification from '../models/notificationModel.js'

export const followUser = async (req, res) => {
  try {
    const follower = req.user._id
    const { userId } = req.params

    if (follower.toString() === userId) {
      return res.status(400).json({ message: 'Нельзя подписаться на себя' })
    }

    const exists = await Follow.findOne({ follower, following: userId })
    if (exists) {
      return res.status(400).json({ message: 'Вы уже подписаны' })
    }

    const userExists = await User.findById(userId)
    if (!userExists) {
      return res.status(404).json({ message: 'Пользователь не найден' })
    }

    await Follow.create({ follower, following: userId })

    await User.findByIdAndUpdate(userId, {
      $addToSet: { followers: follower },
    })

    await User.findByIdAndUpdate(follower, {
      $addToSet: { following: userId },
    })

    await Notification.create({
      user: userId,
      fromUser: follower,
      type: 'follow',
      text: 'started following you',
    })

    res.json({ success: true, message: 'Подписка успешна' })
  } catch (error) {
    console.error('FOLLOW ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const unfollowUser = async (req, res) => {
  try {
    const follower = req.user._id
    const { userId } = req.params

    await Follow.findOneAndDelete({ follower, following: userId })

    await User.findByIdAndUpdate(userId, {
      $pull: { followers: follower },
    })

    await User.findByIdAndUpdate(follower, {
      $pull: { following: userId },
    })

    res.json({ success: true, message: 'Отписка выполнена' })
  } catch (error) {
    console.error('UNFOLLOW ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const checkFollow = async (req, res) => {
  try {
    const follower = req.user._id
    const { userId } = req.params

    const exists = await Follow.findOne({ follower, following: userId })

    res.json({ isFollowing: Boolean(exists) })
  } catch (error) {
    console.error('CHECK FOLLOW ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params

    const followers = await Follow.find({ following: userId }).populate(
      'follower',
      'username fullName avatar',
    )

    res.json(followers)
  } catch (error) {
    console.error('GET FOLLOWERS ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params

    const following = await Follow.find({ follower: userId }).populate(
      'following',
      'username fullName avatar',
    )

    res.json(following)
  } catch (error) {
    console.error('GET FOLLOWING ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
