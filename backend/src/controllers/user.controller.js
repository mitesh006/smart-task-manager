import mongoose from "mongoose"
import Project from "../models/Project.model.js"
import Task from "../models/Task.model.js"
import User from "../models/User.model.js"


// @desc get logged in user's global dashbaord metrics
// @route GET /api/user/dashboard/metrics
// @access Private

export const userPersonalMetrics = async (req, res) => {

    try {


        const userId = new mongoose.Types.ObjectId(req.user._id)

        const personalMetrics = await Task.aggregate([

            {
                $match: { assignedTo: userId }
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
                    ]
                }
            }

        ])

        return res.status(200).json({
            data: personalMetrics[0]
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


// @desc Update user profile (name and/or password)
// @route PUT /api/user/profile
// @access Private
export const updateProfile = async (req, res) => {
    try {
        const { name, password } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (name) user.name = name;
        if (password) user.password = password;

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: Object.values(error.errors)[0].message
            });
        }
        console.error('Update profile error:', error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
}