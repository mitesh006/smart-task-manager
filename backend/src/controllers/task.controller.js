import Project from "../models/Project.model.js"
import Task from "../models/Task.model.js"
import User from "../models/User.model.js"


// @desc    Create a new task inside project workspace
// @route   POST /api/tasks
// @access  Private

//Only project members can create tasks and assignee must be part of the project

export const createTask = async (req, res) => {

    const {title, description, status, priority, dueDate, project} = req.body

    try {

        if(!project) {
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
        
        if(!isMember) {
            return res.status(403).json({
                message: "Access Denied: Only Project members can add tasks to this workspace."
            })
        }

        if(req.body.assignedTo) {
            const isAssigneeMember = parentProject.members.some(
                (m) => m.user.toString() === req.body.assignedTo.toString()
            )

            if(!isAssigneeMember) {
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
            project,
            assignedTo: req.body.assignedTo || null
        })

        await task.save()

        return res.status(201).json({
            message: "Task created successfully inside workspace."
        })

    } catch (error) {
        
        if(error.name === 'ValidationError') {
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

export const updateTask = async (req, params) => {
    
    const {id} = req.params


    try {

        const task = await Task.findById(id)

        if(!task) {
            return res.status(404).json({
                message: "Task not found."
            })
        }

        const parentProject = await Project.findById(task.project)
        
        const isMember = await parentProject.members.some(
            (m) => m.user.toString() === req.user._id.toString()
        )

        if(!isMember) {
            return res.status(403).json({
                message: "Access Denied: Only Project members can update tasks in this workspace."
            })
        }

// Continue here

    } catch (error) {

        if (error.kind === "ObjectId") {
            return res.status(400).json({ message: "Invalid project identifier format." });
        }

        return res.status(500).json({
            message: "Internal Server Error."
        })
    }

}