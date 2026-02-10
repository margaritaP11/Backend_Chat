import sharp from 'sharp'
import Post from '../models/postModel.js'
import Like from '../models/likeModel.js'
import Follow from '../models/followModel.js'
import Comment from '../models/commentModel.js' // ← ДОДАНО

/* CREATE POST */
export const createPost = async (req, res) => {
  try {
    const userId = req.user._id
    const { text } = req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' })
    }

    const resizedImage = await sharp(req.file.buffer)
      .resize(800)
      .jpeg({ quality: 70 })
      .toBuffer()

    const post = await Post.create({
      text,
      image: `data:image/jpeg;base64,${resizedImage.toString('base64')}`,
      user: userId,
    })

    res.json(post)
  } catch (error) {
    console.log('CREATE POST ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* FEED */
export const getFeedPosts = async (req, res) => {
  try {
    const currentUserId = req.user._id

    // 1. Load posts
    const posts = await Post.find()
      .populate('user', 'username avatar fullName')
      .sort({ createdAt: -1 })
      .limit(50)

    // 2. Load following list
    const followingDocs = await Follow.find({ follower: currentUserId })
    const followingIds = followingDocs.map((f) => f.following.toString())

    // 3. Attach comments + likes + following
    const postsWithData = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.countDocuments({ post: post._id })
        const liked = await Like.findOne({
          post: post._id,
          user: currentUserId,
        })

        // ← Load comments from separate collection
        const comments = await Comment.find({ post: post._id })
          .populate('user', 'username avatar')
          .sort({ createdAt: 1 })

        return {
          ...post.toJSON(),
          comments, // ← ADD COMMENTS HERE
          likesCount,
          liked: Boolean(liked),
          isFollowing: followingIds.includes(post.user._id.toString()),
        }
      }),
    )

    res.json(postsWithData)
  } catch (error) {
    console.error('FEED ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* EXPLORE */
export const getExplorePosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })

    res.json(posts)
  } catch (error) {
    console.error('EXPLORE ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* ADD COMMENT */
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id
    const userId = req.user._id
    const { text } = req.body

    if (!text) return res.status(400).json({ message: 'Comment is required' })

    // Create comment in separate collection
    const comment = await Comment.create({
      user: userId,
      post: postId,
      text,
    })

    const populated = await comment.populate('user', 'username avatar')

    res.json(populated)
  } catch (error) {
    console.error('ADD COMMENT ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* GET USER POSTS */
export const getUserPosts = async (req, res) => {
  try {
    const profileOwnerId = req.params.id
    const currentUserId = req.user._id

    const posts = await Post.find({ user: profileOwnerId })
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar')

    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.countDocuments({ post: post._id })
        const liked = await Like.findOne({
          post: post._id,
          user: currentUserId,
        })

        const comments = await Comment.find({ post: post._id })
          .populate('user', 'username avatar')
          .sort({ createdAt: 1 })

        return {
          ...post.toJSON(),
          comments,
          likesCount,
          liked: Boolean(liked),
        }
      }),
    )

    res.json(postsWithLikes)
  } catch (error) {
    console.error('GET USER POSTS ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* DELETE POST */
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id
    const post = await Post.findById(postId)

    if (!post) return res.status(404).json({ message: 'Post not found' })
    if (post.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' })

    await Comment.deleteMany({ post: postId }) // ← delete comments too
    await post.deleteOne()

    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('DELETE POST ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* GET POST BY ID */
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'user',
      'username avatar',
    )

    if (!post) return res.status(404).json({ message: 'Post not found' })

    const comments = await Comment.find({ post: post._id })
      .populate('user', 'username avatar')
      .sort({ createdAt: 1 })

    res.json({
      ...post.toJSON(),
      comments,
    })
  } catch (error) {
    console.error('GET POST BY ID ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/* UPDATE POST */
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) return res.status(404).json({ message: 'Post not found' })
    if (post.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' })

    if (req.body.text) post.text = req.body.text

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

/* GET ALL POSTS */
export const getAllPosts = async (req, res) => {
  try {
    const currentUserId = req.user._id

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar')

    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.countDocuments({ post: post._id })
        const liked = await Like.findOne({
          post: post._id,
          user: currentUserId,
        })

        const comments = await Comment.find({ post: post._id })
          .populate('user', 'username avatar')
          .sort({ createdAt: 1 })

        return {
          ...post.toJSON(),
          comments,
          likesCount,
          liked: Boolean(liked),
        }
      }),
    )

    res.json(postsWithLikes)
  } catch (error) {
    console.error('GET ALL POSTS ERROR:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
