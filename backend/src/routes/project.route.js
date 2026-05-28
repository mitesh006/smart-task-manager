import express from "express"
import { addMember, createProject, deleteProject, getAllProjects, getProject, removeMember, transferOwnership, updateMembersRole, updateProject } from "../controllers/project.controller.js"
import protectRoute from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post('/',protectRoute, createProject)
router.post('/:id/members',protectRoute, addMember)

router.get('/',protectRoute, getAllProjects)
router.get('/:id/',protectRoute, getProject)

router.put('/:id', protectRoute, updateProject)
router.put('/:id/transfer-ownership', protectRoute,transferOwnership )
router.put('/:id/members/role', protectRoute, updateMembersRole)

router.delete('/:id', protectRoute, deleteProject)
router.delete('/:id/members', protectRoute, removeMember)

export default router