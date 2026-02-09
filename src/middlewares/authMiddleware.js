import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. Token missing.' })
    }

    const token = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // ⭐ ВАЖЛИВО: повертаємо user як є, з _id
    req.user = user

    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
