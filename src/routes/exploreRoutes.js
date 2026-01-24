import express from 'express'
import { getExplorePosts } from '../controllers/exploreController.js'

const router = express.Router()

router.get('/', getExplorePosts)

export default router
