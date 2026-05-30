import mongoose from "mongoose"
import Project from "../models/Project.model.js"
import Task from "../models/Task.model.js"
import User from "../models/User.model.js"


// @desc    Create a project workspace
// @route   POST /api/projects
// @access  Private

// Any logged in user can create a project
export const createProject = async (req, res) => {

    const { name, description } = req.body

    try {

        const newProject = new Project({
            name,
            description,
            owner: req.user._id,
            members: [{
                user: req.user._id,
                role: "Manager"
            }]
        })

        if (req.body.members && Array.isArray(req.body.members)) {
            newProject.members = [...newProject.members, ...req.body.members]
        }

        await newProject.save()

        return res.status(201).json({
            message: "Project workspace created succesfully."
        })

    } catch (error) {

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: Object.values(error.errors)[0].message
            })
        }

        return res.status(500).json({
            message: "Internal Server Error."
        })
    }
}

// @desc    Get all projects for the logged-in user
// @route   GET /api/projects
// @access  Private

// Access all projects that the logged in user is member of those projects
export const getAllProjects = async (req, res) => {

    try {
        const projects = await Project.find({
            "members.user": req.user._id
        })
            .populate("owner", "name email")
            .populate("members.user", "name email")

        return res.status(200).json({
            count: projects.length,
            projects
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


// @desc    Get a single project workspace by ID
// @route   GET /api/projects/:id
// @access  Private

// Access a particular project by only if logged in user is a member of that projct
export const getProject = async (req, res) => {

    const { id } = req.params

    try {

        const projectId = new mongoose.Types.ObjectId(id)

        const project = await Project.findById(projectId)
            .populate("owner", "name email")
            .populate("members.user", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Project workspace does not exist."
            })
        }

        const isMember = project.members.some(
            (m) => m.user._id.toString() === req.user._id.toString()
        )

        if (!isMember) {
            return res.status(403).json({
                message: "Access Denied: Only Project members can access this workspace."
            })
        }

        const tasks = await Task.find({ project: projectId })
            .populate("assignedTo", "name email")

        return res.status(200).json({
            project,
            taskCount: tasks.length,
            tasks
        })


    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid project identifier format." });
        }

        return res.status(500).json({
            message: "Internal Server Error."
        })

    }

}

// @desc    Add a team member to a project workspace
// @route   POST /api/projects/:id/members
// @access  Private

// Adding member to workspace by manager only
export const addMember = async (req, res) => {

    const { id } = req.params
    const { email, role } = req.body
    try {

        const projectId = new mongoose.Types.ObjectId(id)

        if (!email) {
            return res.status(400).json({
                message: "Invitee email address is required."
            })
        }

        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(404).json({
                message: "Project workspace does not exist."
            })
        }

        const actorContext = project.members.find(
            (m) => m.user.toString() === req.user._id.toString()
        )

        if (!actorContext || actorContext.role !== "Manager") {
            return res.status(403).json({
                message: "Access Denied: Only workspace manager can add member to this project."
            })
        }

        const targetUser = await User.findOne({ email })
        if (!targetUser) {
            return res.status(404).json({
                message: "User account with this mail does not exist."
            })
        }

        const isAlreadyMember = project.members.some(
            (m) => m.user.toString() === targetUser._id.toString()
        )

        if (isAlreadyMember) {
            return res.status(400).json({
                message: "This user is already a member of this projet."
            })
        }

        project.members.push({
            user: targetUser._id,
            role: role || "Developer"
        })

        await project.save()

        return res.status(201).json({
            message: `${targetUser.name} is now part of the project.`
        })


    } catch (error) {

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: Object.values(error.errors)[0].message
            })
        }

        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid project identifier format." });
        }

        return res.status(500).json({
            message: "Internal Server Error."
        })
    }
}

// @desc Update project details (name, description)
// @route PUT /api/projects/:id/
// @access private

// Only Manager allowed to update the project

export const updateProject = async (req, res) => {

    const { id } = req.params

    try {

        const projectId = new mongoose.Types.ObjectId(id)

        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(404).json({
                message: "Project workspace does not exist."
            })
        }


        const actorContext = await project.members.find(
            (m) => m.user.toString() === req.user._id.toString()
        )

        if (!actorContext || actorContext.role !== "Manager") {
            return res.status(403).json({
                message: "Access Denied: Only workspace manager can add member to this project."
            })
        }

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $set: req.body },
            { new: true, runValidators: true }
        )

        return res.status(200).json({
            message: "Project workspace updated successfully."
        })


    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: Object.values(error.errors)[0].message
            })
        }

        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid project identifier format." });
        }

        return res.status(500).json({
            message: "Internal Server Error."
        })
    }
}

// @desc Remove or leave from Project (name, description)
// @route DELETE /api/projects/:id/members
// @access private

// Only Manager can remove member from project or member can leave from project

export const removeMember = async (req, res) => {

    const { id } = req.params
    const { targetUserId } = req.body

    try {

        const projectId = new mongoose.Types.ObjectId(id)

        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(404).json({
                message: "Project workspace does not exist."
            })
        }


        const actorContext = project.members.find(
            (m) => m.user.toString() === req.user._id.toString()
        )

        if (!actorContext) {
            return res.status(403).json({
                message: "Access Denined: You are not member of this project."
            })
        }


        const targetUser = project.members.find(
            (m) => m.user.toString() === targetUserId
        )

        if (!targetUser) {
            return res.status(404).json({
                message: "The targeted user is not a member of this project."
            })
        }

        const isSelfRemoval = req.user._id.toString() === targetUserId

        const isActorOwner = project.owner.toString() === req.user._id.toString()
        const isTargetOwner = project.owner.toString() === targetUserId

        if (isActorOwner) {
            if (isSelfRemoval) {
                return res.status(403).json({
                    message: "Operation Denied. You are the owner of this project, transfer ownership or delete this project."
                })
            }
        }

        if (actorContext.role === "Viewer" && !isSelfRemoval) {
            return res.status(403).json({
                message: "Access Denied: Viewers do not have permission to remove team members."
            })
        }

        if (actorContext.role === "Developer" && !isSelfRemoval) {
            return res.status(403).json({
                message: "Access Denied. Developers cannot remove other team members."
            })
        }

        if (actorContext.role == "Manager") {
            if (isTargetOwner) {
                return res.status(403).json({
                    message: "Access Denied: Managers do not have permission to remove the project Owner."
                })
            }

            if (isSelfRemoval) {
                const totalManagers = project.members.filter(
                    (m) => m.role === "Manager"
                ).length

                if (totalManagers <= 1) {
                    return res.status(400).json({
                        message: "Operation Denied. You are the owner of this project, transfer ownership or delete this project."
                    })
                }
            }
        }

        project.members = project.members.filter(
            (m) => m.user.toString() !== targetUserId
        )

        await project.save()

        return res.status(200).json({
            message: isSelfRemoval ? "You have left the project workspace successfully." : "Member removed from project workspace successfully."
        })

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: Object.values(error.errors)[0].message
            })
        }

        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid project identifier format." });
        }

        return res.status(500).json({
            message: "Internal Server Error."
        })
    }
}

// @desc    Delete project and all associated tasks
// @route   DELETE /api/projects/:id
// @access  Private

export const deleteProject = async (req, res) => {

    const { id } = req.params

    try {

        const projectId = new mongoose.Types.ObjectId(id)

        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(404).json({
                message: "Project workspace does not exist."
            })
        }

        const actorContext = project.members.find(
            (m) => m.user.toString() === req.user._id.toString()
        )

        if (!actorContext || actorContext.role !== "Manager") {
            return res.status(403).json({
                message: "Access Denied: Only Managers can delete workspaces."
            });
        }

        await Task.deleteMany({ project: projectId })

        await Project.findByIdAndDelete(projectId)

        return res.status(200).json({
            message: "Project workspace and all associated tasks have been permanently deleted."
        })
    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid project identifier format." });
        }

        return res.status(500).json({
            message: "Internal Server Error."
        })

    }
}


// @desc Update member's role
// @route PUT /api/projects/:id/members/role
// @access Private


export const updateMembersRole = async (req, res) => {

    const { id } = req.params
    const { targetUserId, newRole } = req.body

    try {

        const projectId = new mongoose.Types.ObjectId(id)

        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(404).json({
                message: "Project workspace does not exist."
            })
        }

        const actorContext = project.members.find(
            (m) => m.user.toString() === req.user._id.toString()
        )

        if (!actorContext || actorContext.role !== "Manager") {
            return res.status(403).json({
                message: "Access Denied: Only Managers can update a member's role in a project workspace."
            })
        }

        const targetUser = project.members.find(
            (m) => m.user.toString() === targetUserId
        )

        if (!targetUser) {
            return res.status(404).json({
                message: "Target user not found."
            })
        }

        const isActorOwner = project.owner.toString() === req.user._id.toString()
        const isTargetOwner = project.owner.toString() === targetUserId

        if (isTargetOwner) {
            return res.status(403).json({
                message: "Operation Denied. You cannot update role of the owner of this proeject workspace."
            })
        }


        targetUser.role = newRole
        await project.save()

        return res.status(200).json({
            message: `User role has been successfully updated to ${newRole}.`
        });

    } catch (error) {

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: Object.values(error.errors)[0].message
            })
        }

        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid project identifier format." });
        }

        return res.status(500).json({
            message: "Internal Server Error."
        })
    }
}


// @desc transfer ownership of a project
// @route PUT /api/projects/:id/transfer-ownership 
// @access Private

export const transferOwnership = async (req, res) => {

    const { id } = req.params
    const { newOwnerId } = req.body

    try {

        const projectId = new mongoose.Types.ObjectId(id)

        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(404).json({
                message: "Project workspace does not exist."
            })
        }

        const newOwnerContext = project.members.find(
            (m) => m.user.toString() === newOwnerId
        )

        if (!newOwnerContext || newOwnerContext.role !== "Manager") {
            return res.status(403).json({
                message: "Operation Denied: Only a manager can become owner of a worspace."
            })
        }

        const currentOwner = project.owner.toString()
        const isActorOwner = currentOwner === req.user._id.toString()
        const isTargetOwner = currentOwner === newOwnerId


        if (!isActorOwner) {
            return res.status(403).json({
                message: "Only workspace owner can transfer ownership of this project."
            })
        }

        if (isTargetOwner) {
            return res.status(400).json({
                message: "You cannot transfer ownership to yourself as you already are the owner."
            })
        }


        project.owner = newOwnerId

        await project.save()

        return res.status(200).json({
            message: "Ownership has been successfully transferred to the designated manager."
        })

    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid project identifier format." });
        }

        return res.status(500).json({
            message: "Internal Server Error."
        })

    }

}


// @ desc
// @ route GET /api/projects/:id/metrics
// @ access Private

export const projectMetrics = async (req, res) => {

    const { id } = req.params

    try {

        const projectId = new mongoose.Types.ObjectId(id)

        const metrics = await Task.aggregate([

            {
                $match: { project: projectId }
            },

            {
                $facet: {
                    statusCounts: [
                        {
                            $group: {
                                _id: "$status",
                                count: { $count: {} }
                            }
                        }
                    ],
                    priorityCounts: [
                        {
                            $group: {
                                _id: "$priority",
                                count: { $count: {} }
                            }
                        }
                    ],
                    overDueCounts: [
                        {
                            $match: {
                                dueDate: { $lt: new Date() },
                                status: { $ne: "Done" }
                            }
                        },
                        {
                            $count: "count"
                        }
                    ],
                    memberWorkloads: [
                        {
                            $group: {
                                _id: "$assignedTo",
                                taskCount: { $sum: 1 }
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "_id",
                                foreignField: "_id",
                                as: "memberDetails"
                            }
                        },
                        {
                            $unwind: "$memberDetails"
                        },
                        {
                            $project: {
                                _id: 1,
                                taskCount: 1,
                                name: "$memberDetails.name",
                                email: "$memberDetails.email"
                            }
                        }
                    ]
                }
            }
        ])

        return res.status(200).json({
            data: metrics[0]
        })

    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid project identifier format." });
        }

        return res.status(500).json({
            message: "Internal Server Error." + error
        })

    }
}