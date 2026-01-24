import sharp from 'sharp'
import Post from '../models/postModel.js'
import Like from '../models/likeModel.js'

export const createPost = async (req, res) => {
  try {
    let base64Image = ''

    if (req.file) {
      const resizedImage = await sharp(req.file.buffer)
        .resize(800) // ширина 800px
        .jpeg({ quality: 70 })
        .toBuffer()

      base64Image = `data:image/jpeg;base64,${resizedImage.toString('base64')}`
    }

    const post = await Post.create({
      text: req.body.text,
      image: base64Image,
      user: req.user,
    })

    res.json(post)
  } catch (error) {
    console.error('CREATE POST ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id

    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 }) // новые сверху

    res.json(posts)
  } catch (error) {
    console.error('GET USER POSTS ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id

    // Находим пост
    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Проверяем, что автор поста — текущий пользователь
    if (post.user.toString() !== req.user) {
      return res.status(403).json({ message: 'Access denied. Not your post.' })
    }

    // Удаляем
    await post.deleteOne()

    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('DELETE POST ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id

    const post = await Post.findById(postId).populate('user', 'name avatar')

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.json(post)
  } catch (error) {
    console.error('GET POST BY ID ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id
    const userId = req.user

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Проверяем, что пост принадлежит пользователю
    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // Обновляем текст, если он есть
    if (req.body.text) {
      post.text = req.body.text
    }

    // Обновляем картинку, если она есть
    if (req.file) {
      const resizedImage = await sharp(req.file.buffer)
        .resize(800)
        .jpeg({ quality: 70 })
        .toBuffer()

      post.image = `data:image/jpeg;base64,${resizedImage.toString('base64')}`
    }

    await post.save()

    res.json({ message: 'Post updated successfully', post })
  } catch (error) {
    console.error('UPDATE POST ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar')

    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.countDocuments({ post: post._id })

        const isLiked = await Like.findOne({
          post: post._id,
          user: req.user, // текущий пользователь
        })

        return {
          ...post.toObject(),
          likesCount,
          isLiked: Boolean(isLiked),
        }
      }),
    )

    res.json(postsWithLikes)
  } catch (error) {
    console.error('GET ALL POSTS ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
