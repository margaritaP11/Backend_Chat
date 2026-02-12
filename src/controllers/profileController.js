import User from '../models/userModel.js'
import path from 'path'
import fs from 'fs'

// ---------------------- CREATE PROFILE ----------------------
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

// ---------------------- GET MY PROFILE ----------------------
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

// ---------------------- GET USER PROFILE ----------------------
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

// ---------------------- UPDATE PROFILE ----------------------
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

// ---------------------- UPDATE AVATAR ----------------------
export const updateAvatar = async (req, res) => {
  try {
    console.log('UPDATE AVATAR HIT, file:', req.file)

    const userId = req.user._id

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const filePath = `uploads/${req.file.filename}`

    const user = await User.findById(userId)

    if (user.avatar && user.avatar.startsWith('uploads/')) {
      const oldPath = path.join(process.cwd(), user.avatar)
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: filePath },
      { new: true },
    ).select('-password')

    res.json(updatedUser)
  } catch (error) {
    console.error('UPDATE AVATAR ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// ---------------------- DELETE AVATAR ----------------------
export const deleteAvatar = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)

    if (!user) return res.status(404).json({ message: 'User not found' })

    if (user.avatar && user.avatar.startsWith('uploads/')) {
      const filePath = path.join(process.cwd(), user.avatar)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    user.avatar = ''
    await user.save()

    res.json({ message: 'Avatar deleted successfully' })
  } catch (error) {
    console.error('DELETE AVATAR ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
