import User from '../models/userModel.js'
import Follow from '../models/followModel.js'
import sharp from 'sharp'

/* ---------------------------------------------
   📌 Создать профиль (POST /api/profile/me)
---------------------------------------------- */
export const createUserProfile = async (req, res) => {
  try {
    const userId = req.user._id

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.username = req.body.username || user.username
    user.fullName = req.body.fullName || user.fullName
    user.website = req.body.website || user.website
    user.bio = req.body.bio || user.bio

    await user.save()

    res.json(user)
  } catch (error) {
    console.error('CREATE PROFILE ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* ---------------------------------------------
   📌 Получить свой профиль (GET /api/profile/me)
---------------------------------------------- */
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user._id

    const user = await User.findById(userId).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json(user)
  } catch (error) {
    console.error('GET MY PROFILE ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* ---------------------------------------------
   📌 Получить профиль по ID (GET /api/profile/:id)
---------------------------------------------- */
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id

    const user = await User.findById(userId).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json(user)
  } catch (error) {
    console.error('GET PROFILE ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* ---------------------------------------------
   📌 Обновить профиль (PUT /api/profile/me)
---------------------------------------------- */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id
    const updates = {}

    if (req.body.username) updates.username = req.body.username
    if (req.body.fullName) updates.fullName = req.body.fullName
    if (req.body.website) updates.website = req.body.website
    if (req.body.bio) updates.bio = req.body.bio

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select('-password')

    res.json(updatedUser)
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* ---------------------------------------------
   📌 Обновить аватар (PUT /api/profile/avatar)
---------------------------------------------- */
export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user._id

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const resizedImage = await sharp(req.file.buffer)
      .resize(400)
      .jpeg({ quality: 70 })
      .toBuffer()

    const base64Image = `data:image/jpeg;base64,${resizedImage.toString('base64')}`

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: base64Image },
      { new: true },
    ).select('-password')

    res.json(updatedUser)
  } catch (error) {
    console.error('UPDATE AVATAR ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* ---------------------------------------------
   📌 Удалить аватар
---------------------------------------------- */
export const deleteAvatar = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)

    if (!user) return res.status(404).json({ message: 'User not found' })

    user.avatar = ''
    await user.save()

    res.json({ message: 'Avatar deleted successfully' })
  } catch (error) {
    console.error('DELETE AVATAR ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* ---------------------------------------------
   📌 Удалить пользователя
---------------------------------------------- */
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id

    const deletedUser = await User.findByIdAndDelete(userId)
    if (!deletedUser) return res.status(404).json({ message: 'User not found' })

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('DELETE USER ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
