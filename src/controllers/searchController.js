import User from '../models/userModel.js'

export const searchUsers = async (req, res) => {
  const query = req.query.q?.trim()
  if (!query) return res.json([])

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { fullName: { $regex: query, $options: 'i' } },
      ],
    }).select('username fullName avatar')

    res.json(users)
  } catch (err) {
    console.error('SEARCH ERROR:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
