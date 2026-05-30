import mongoose from "mongoose"
import Project from "../models/Project.model.js"
import Task from "../models/Task.model.js"


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