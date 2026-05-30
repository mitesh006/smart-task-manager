import jwt from "jsonwebtoken"
import User from "../models/User.model.js"

const protectRoute = async (req, res, next) => {

    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access. Please log in."
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized access. Corrupt token."
            })
        }

        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(404).json({
                message: "User no longer exist."
            })
        }

        req.user = user
        next()

    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error. : " + error
        })
    }
}

export default protectRoute