import express from "express"
import protectRoute from "../middlewares/auth.middleware.js"
import { userPersonalMetrics, updateProfile } from "../controllers/user.controller.js"

const router = express.Router()

router.get('/dashboard/metrics', protectRoute, userPersonalMetrics)
router.put('/profile', protectRoute, updateProfile)

export default router