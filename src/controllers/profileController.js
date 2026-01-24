import User from '../models/userModel.js'
import Follow from '../models/followModel.js'
import sharp from 'sharp'

// 📌 Получение профиля + счётчики подписчиков и подписок
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user

    const user = await User.findById(userId).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Счётчики
    const followersCount = await Follow.countDocuments({ following: userId })
    const followingCount = await Follow.countDocuments({ follower: userId })

    // Проверяем подписан ли текущий пользователь

    const isFollowing = await Follow.exists({
      follower: currentUserId,
      following: userId,
    })

    res.json({
      user,
      followersCount,
      followingCount,
    })
  } catch (error) {
    console.error('GET PROFILE ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// 📌 Обновление профиля
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user
    const updates = {}

    if (req.body.fullName) updates.fullName = req.body.fullName
    if (req.body.bio) updates.bio = req.body.bio
    if (req.body.avatar) updates.avatar = req.body.avatar

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select('-password')

    res.json(updatedUser)
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// 📌 Обновление аватара
export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const resizedImage = await sharp(req.file.buffer)
      .resize(400)
      .jpeg({ quality: 70 })
      .toBuffer()

    const base64Image = `data:image/jpeg;base64,${resizedImage.toString('base64')}`

    user.avatar = base64Image
    await user.save()

    res.json({ message: 'Avatar updated successfully' })
  } catch (error) {
    console.error('UPDATE AVATAR ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// 📌 Удаление пользователя
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id

    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('DELETE USER ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// 📌 Удаление аватара
export const deleteAvatar = async (req, res) => {
  try {
    const userId = req.user
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.avatar = ''
    await user.save()

    res.json({ message: 'Avatar deleted successfully' })
  } catch (error) {
    console.error('DELETE AVATAR ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
