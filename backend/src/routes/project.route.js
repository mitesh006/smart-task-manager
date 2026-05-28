import express from "express"
import { addMember, createProject, deleteProject, getAllProjects, getProject, removeMember, updateProject } from "../controllers/project.controller.js"
import protectRoute from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post('/',protectRoute, createProject)
router.get('/',protectRoute, getAllProjects)
router.post('/:id/members',protectRoute, addMember)
router.get('/:id/',protectRoute, getProject)
router.put('/:id', protectRoute, updateProject)
router.delete('/:id/members', protectRoute, removeMember)
router.delete('/:id', protectRoute, deleteProject)
router.put('/:id/members', protectRoute, update)
// updateMembers
export default router