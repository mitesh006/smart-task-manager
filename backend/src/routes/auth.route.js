import express from "express"
import { login, logout, me, sendOtp, verifyOtpAndRegister } from "../controllers/auth.controller.js"
import protectRoute from "../middlewares/auth.middleware.js"
const router = express.Router()

router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtpAndRegister)

router.post('/login', login)
router.post('/logout', logout)


router.get('/me', protectRoute, me)

export default router