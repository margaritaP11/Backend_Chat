export const createUserProfile = async (req, res) => {
  try {
    const userId = req.user

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
