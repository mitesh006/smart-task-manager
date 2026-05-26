import express from "express"
import { addMember, createProject, getAllProjects, getProject } from "../controllers/project.controller.js"
import protectRoute from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post('/',protectRoute, createProject)
router.get('/',protectRoute, getAllProjects)
router.post('/:id/members',protectRoute, addMember)
router.get('/:id/',protectRoute, getProject)

export default router