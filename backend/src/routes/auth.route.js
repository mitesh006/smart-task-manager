import express from "express"
import {register, login} from "../controllers/auth.controller.js"
import protectRoute from "../middlewares/auth.middleware.js"
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)


router.get('/me', protectRoute, me )

export default router