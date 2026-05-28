import Project from "../models/Project.model.js"
import Task from "../models/Task.model.js"
import User from "../models/User.model.js"


// @desc    Create a new task inside project workspace
// @route   POST /api/tasks
// @access  Private

//Only project members can CREATE tasks and assignee must be part of the project

export const createTask = async (req, res) => {

    const { title, description, status, priority, dueDate, project } = req.body

    try {

        if (!project) {
            return res.status(400).json({
                message: "Project workspace is required."
            })
        }

        const parentProject = await Project.findById(project)

        if (!parentProject) {
            return res.status(404).json({
                message: "Project workspace not found."
            })
        }

        const isMember = await parentProject.members.some(
            (m) => m.user.toString() === req.user._id.toString()
        )

        if (!isMember) {
            return res.status(403).json({
                message: "Access Denied: Only Project members can add tasks to this workspace."
            })
        }

        if (req.body.assignedTo) {
            const isAssigneeMember = parentProject.members.some(
                (m) => m.user.toString() === req.body.assignedTo.toString()
            )

            if (!isAssigneeMember) {
                return res.status(400).json({
                    message: "Assigned user is not a member of project workspace."
                })
            }
        }

        const task = new Task({
            title,
            description,
            status,
            priority,
            dueDate: req.body.dueDate || null,
            owner: req.user._id,
            project,
            assignedTo: req.body.assignedTo || null
        })

        await task.save()

        return res.status(201).json({
            message: "Task created successfully inside workspace."
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

// @desc    Modify a task inside project workspace
// @route   PUT /api/tasks
// @access  Private

//Only project manager, task owner and task assignee can MODIFY tasks.

export const updateTask = async (req, res) => {

    const { id } = req.params


    try {

        const task = await Task.findById(id)

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            })
        }

        const parentProject = await Project.findById(task.project)

        const actorContext = await parentProject.members.find(
            (m) => m.user.toString() === req.user._id.toString()
        )

        if (!actorContext) {
            return res.status(403).json({
                message: "Access Denied: You are not a member of this project workspace."
            })
        }

        const isManager = actorContext.role === "Manager"
        const isOwner = task.owner.toString() === req.user._id.toString()
        const isAssignedToMe = task.assignedTo.toString() === req.user._id.toString()

        if (!isManager && !isOwner && !isAssignedToMe) {
            return res.status(403).json({
                message: "Access Denied: You are not authorized to modify this task."
            })
        }

        if (req.body.assignedTo) {
            const isAssigneeMember = parentProject.members.some(
                (m) => m.user.toString() === req.body.assignedTo.toString()
            )

            if (!isAssigneeMember) {
                return res.status(400).json({
                    message: "Assigned user is not a member of project workspace."
                })
            }
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        )

        return res.status(200).json({
            message: "Task updated successfully inside workspace."
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

// @desc    Delete a task from project workspace
// @route   DELETE /api/tasks
// @access  Private

//Only project manager, task owner and task assignee can DELETE tasks.

export const deleteTask = async (req, res) => {

    const { id } = req.params

    try {

        const task = await Task.findById(id)

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            })
        }

        const parentProject = await Project.findById(task.project)

        const actorContext = await parentProject.members.find(
            (m) => m.user.toString() === req.user._id.toString()
        )

        if (!actorContext) {
            return res.status(403).json({
                message: "Access Denied: You are not a member of this project workspace."
            })
        }

        const isManager = actorContext.role === "Manager"
        const isOwner = task.owner.toString() === req.user._id.toString()
        const isAssignedToMe = task.assignedTo.toString() === req.user._id.toString()

        if (!isManager && !isOwner && !isAssignedToMe) {
            return res.status(403).json({
                message: "Access Denied: You are not authorized to delete this task."
            })
        }

        await Task.findByIdAndDelete(id)

        return

    } catch (error) {

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: Object.values(error.errors)[0].message
            })
        }

    }
}