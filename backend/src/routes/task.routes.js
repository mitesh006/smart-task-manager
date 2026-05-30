import express from "express"
import protectRoute from "../middlewares/auth.middleware.js"
import { createTask, deleteTask, updateTask } from "../controllers/task.controller.js"

const router = express.Router()


router.post('/', protectRoute, createTask)
router.put('/:id', protectRoute, updateTask)
router.delete('/:id', protectRoute, deleteTask)

export default router