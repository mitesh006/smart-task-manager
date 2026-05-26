import mongoose from "mongoose"

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Project name is required"],
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        members: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            role: {
                type: String,
                enum: ["Manager","Member","Viewer"],
                default: "Member"
            }
        }]
    },
    {
        timestamps: true
    }
)

const Project = mongoose.model('Project',projectSchema)

export default Project