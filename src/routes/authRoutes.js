import express from 'express'
import { register, login } from '../controllers/authController.js'
import {
  registerValidation,
  loginValidation,
} from '../validators/authValidators.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'Your profile', userId: req.user })
})

export default router
