import UserModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export const register = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body

    const existing = await UserModel.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'Email already used' })
    }

    const user = new UserModel({ username, fullName, email, password })
    await user.save()

    const token = generateToken(user._id)

    res.status(201).json({
      message: 'Registered',
      user: { id: user._id, username, fullName, email },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Incorrect email or password' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect email or password' })
    }

    const token = generateToken(user._id)

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email,
      },
      token,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
