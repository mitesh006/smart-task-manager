import Project from "../models/Project.model.js"
import Task from "../models/Task.model.js"
import User from "../models/User.model.js"


// @desc    Create a project workspace
// @route   POST /api/projects
// @access  Private

// Any logged in user can create a project
export const createProject = async (req, res) => {

    const {name, description} = req.body

    try {
    
        const newProject = new Project({
            name ,
            description,
            owner: req.user._id,
            members:[{
                user: req.user._id,
                role: "Manager"
            }]
        })

        await newProject.save()

        return res.status(201).json({
            message: "Project workspace created succesfully."
        })
        
    } catch (error) {
        
        if(error.name === 'ValidationError') {
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
export const getAllProjects = async(req, res) => {

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
    
    const{ id } = req.params 

    try {
        
        const project = await Project.findById(id)
            .populate("owner", "name email")
            .populate("members.user", "name email");

        if(!project) {
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

        const tasks = await Task.find({project: id})
            .populate("assignedTo", "name email")

        return res.status(200).json({
            project,
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
    
    const{ id } = req.params 
    const {email, role} = req.body
    try {
        
        if(!email) {
            return res.status(400).json({
                message: "Invitee email address is required."
            })
        }

        const project = await Project.findById(id)

        if(!project) {
            return res.status(404).json({
                message: "Project workspace does not exist."
            })
        }
        
        const actorContext = project.members.find(
            (m) => m.user.toString() === req.user._id.toString()
        )
        
        if(!actorContext || actorContext.role !== "Manager") {
            return res.status(403).json({
                message: "Access Denied: Only workspace manager can add member to this project."
            })
        }
        
        const targetUser = await User.findOne({email})
        if(!targetUser) {
            return res.status(404).json({
                message: "User account with this mail does not exist."
            })
        }
        
        const isAlreadyMember = project.members.some(
            (m) => m.user.toString() === targetUser._id.toString()
        )
        
        if(isAlreadyMember) {
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

// @desc Update project details (name, description)
// @route PUT /api/projects/:id/
// @access private

// Only Manager allowed to update the project

export const updateProject = async (req, res) => {
    
    const {id} = req.params
    
    try {
        
        const project = await Project.findById(id)
        
        if(!project) {
            return res.status(404).json({
                message: "Project workspace does not exist."
            })
        }
        
        
        const actorContext = await project.members.find(
            (m) => m.user.toString() === req.user._id.toString()
        )
        
        if(!actorContext || actorContext.role !== "Manager") {
            return res.status(403).json({
                message: "Access Denied: Only workspace manager can add member to this project."
            })
        }
        
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            {$set: req.body},
            {new: true, runValidators: true}
        )
        
        return res.status(200).json({
            message: "Project workspace updated successfully."
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

// @desc Remove or leave from Project (name, description)
// @route DELETE /api/projects/:id/members
// @access private

// Only Manager can remove member from project or member can leave from project

export const removeMember = async (req, res) => {
    
    const { id } = req.params
    const {userIdToRemove} = req.body
    
    try {
        
        
        
        const project = await Project.findById(id)
        
        if(!project) {
            return res.status(404).json({
                message: "Project workspace does not exist."
            })
        }
        
        const isActorOwner = project.owner.toString() === req.user._id.toString()
        
        const actorContext = project.members.find(
            (m) => m.user.toString() === req.user._id.toString()
        )
        
        if(!actorContext) {
            return res.status(403).json({
                message: "Access Denined: You are not member of this project."
            })
        }
        
        const isTargetOwner = project.owner.toString() === userIdToRemove
        
        const targetUser =  project.members.find(
            (m) => m.user.toString() === req.userIdToRemove
        )
        
        if(!targetUser) {
            return res.status(404).json({
                message: "The targeted user is not a member of this project."
            })
        }
        
        const isSelfRemoval = req.user._id.toString() === userIdToRemove
        
        if(isActorOwner) {
            if(isSelfRemoval) {
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
        
        if(actorContext.role === "Developer" && !isSelfRemoval) {
            res.status(403).json({
                message: "Access Denied. Developers cannot remove other team members."
            })
        }
        
        if(actorContext.role == "Manager") {
            if(isTargetOwner) {
                return res.status(403).json({
                    message: "Access Denied: Managers do not have permission to remove the project Owner."
                })
            }
            
            if(isSelfRemoval) {
                const totalManagers = project.members.filter(
                    (m) => m.role === "Manager"
                ).length
                
                if(totalManagers <= 1) {
                    return res.status(400).json({
                        message: "Operation Denied. You are the owner of this project, transfer ownership or delete this project."
                    })
                }
            }
        }
        
        project.members = project.members.filter(
            (m) => m.user.toString() !== userIdToRemove
        )
        
        await project.save()
        
        return res.status(200).json({
            message: isSelfRemoval ? "You have left the project workspace successfully." : "Member removed from project workspace successfully." 
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

// @desc    Delete project and all associated tasks
// @route   DELETE /api/projects/:id
// @access  Private

export const deleteProject = async (req, res) => {
    
    const {id} = req.params
    
    try {
        
        
        const project = await Project.findById(id)
        
        if(!project) {
            return res.status(404).json({
                message: "Project workspace does not exist."
            })
        }
        
        const actorContext = project.members.find(
            (m) => m.user.toString() === req.user._id.toString()
        )
        
        if (actorContext.role !== "Manager") {
            return res.status(403).json({
                message: "Access Denied: Only Managers can delete workspaces."
            });
        }
        
        await Task.deleteMany({ project: id })
        
        await Project.findByIdAndDelete(id)
        
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

