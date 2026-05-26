import Project from "../models/Project.model.js"
import Task from "../models/Task.model.js"
import User from "../models/User.model.js"


// @desc    Create a project workspace
// @route   POST /api/projects
// @access  Private
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
            message: "Internal Server Error." + error
        })
        
    }
    
}

// @desc    Add a team member to a project workspace
// @route   POST /api/projects/:id/members
// @access  Private
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
        
        const reqUserDetail = project.members.find(
            (m) => m.user.toString() === req.user._id.toString()
        )
        
        if(!reqUserDetail || reqUserDetail.role !== "Manager") {
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
            role: role || "Member"
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
            message: "Internal Server Error." + error
        })
    }
} 
