import User from "../models/User.model.js"
import generateTokenAndSetCookie from "../utils/genToken.js"
const register = async (req, res) => {
    
    const {name, email, password} = req.body
    
    try {
        const newUser = await User.create({
            name,
            email,
            password        //encrypted password by bcrypt
        })
        
        
        return res.status(201).json({
            message: "User Registered."
        })
        
    } catch (error) {
        if(error.code === 11000) {
            return res.status(400).json ({
                message: "An account with email is already exist."                
            })
        }
        //checks for empty field, password and email validation
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


const login = async (req, res) => {
    const {email, password} = req.body
    
    try {
        
        if (!email || !password) {
            return res.status(400).json({
                message: "Provide both email and password."
            })
        }

        
        const user = await User.findOne({email})
        
        //compares using bcrypt
        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                message: "Invalid email or password."
            })
        }
        
        // sets cookie for authentication using a jwt utiliy
        generateTokenAndSetCookie (res, user._id)
        
        return res.status(200).json({
            message: "User Logged in.",
            user           
        })


    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error."
        })
    }
}

export {register, login}