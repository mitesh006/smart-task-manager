import express from "express"
import protectRoute from "../middlewares/auth.middleware.js"
import { userPersonalMetrics } from "../controllers/user.controller.js"

const router = express.Router()

router.get('/dashboard/metrics', protectRoute, userPersonalMetrics)

export default router