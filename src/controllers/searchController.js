import User from '../models/userModel.js'

export const searchUsers = async (req, res) => {
  const query = req.query.q
  if (!query) return res.json([])

  const users = await User.find({
    $or: [
      { username: { $regex: query, $options: 'i' } },
      { fullName: { $regex: query, $options: 'i' } },
    ],
  }).select('username fullName avatar')

  res.json(users)
}
