import express from 'express'
import { getStats } from '../controllers/stats.controller.js'

const router = express.Router()

// Public stats endpoint
router.get('/', getStats)

export default router
