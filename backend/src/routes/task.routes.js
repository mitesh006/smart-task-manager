import express from "express"
import protectRoute from "../middlewares/auth.middleware.js"
import { createTask, updateTask } from "../controllers/task.controller.js"

const router = express.Router()


router.post('/', protectRoute, createTask)
router.post('/:id', protectRoute, updateTask)


export default router