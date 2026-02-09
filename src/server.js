import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cors from 'cors'

// Маршруты
import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import likeRoutes from './routes/likeRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import exploreRoutes from './routes/exploreRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import followRoutes from './routes/followRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import userRoutes from './routes/userRoutes.js'

// Socket.io
import { Server } from 'socket.io'
import socketHandler from './socket/socket.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5175'],
    credentials: true,
  }),
)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req, res, next) => {
  console.log('REQUEST:', req.method, req.url)
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/likes', likeRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/explore', exploreRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/follow', followRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Сервер работает ✅')
})

//
const start = async () => {
  try {
    await connectDB()

    const server = app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    })

    const io = new Server(server, {
      cors: {
        origin: 'http://localhost:5173',
        credentials: true,
      },
    })

    socketHandler(io)
  } catch (error) {
    console.error('Error starting server:', error)
  }
}

start()
