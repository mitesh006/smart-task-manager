import crypto from 'crypto'
import User from "../models/User.model.js"
import Otp from "../models/Otp.model.js"
import generateTokenAndSetCookie from "../utils/genToken.js"
import { sendMail } from "../utils/mailer.js"
import { otpEmailTemplate, welcomeEmailTemplate } from "../utils/emailTemplates.js"


// @desc    Send OTP to email for verification (Step 1 of registration)
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOtp = async (req, res) => {
    const { name, email, password } = req.body

    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required."
            })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                message: "An account with this email already exists."
            })
        }

        // Validate password strength before sending OTP
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!passRegex.test(password)) {
            return res.status(400).json({
                message: "Password is too weak. It must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
            })
        }

        // Delete any existing OTP for this email
        await Otp.deleteMany({ email })

        // Generate 6-digit OTP
        const otpCode = crypto.randomInt(100000, 999999).toString()

        // Store OTP with registration data (OTP gets hashed via pre-save hook)
        await Otp.create({
            email,
            otp: otpCode,
            name,
            password, // Stored temporarily, will be hashed when User is created
        })

        // Send OTP email
        await sendMail(
            email,
            'Your TaskFlow verification code',
            otpEmailTemplate(name, otpCode)
        )

        return res.status(200).json({
            message: "Verification code sent to your email."
        })

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: Object.values(error.errors)[0].message
            })
        }

        console.error('Send OTP error:', error)
        return res.status(500).json({
            message: error.message || "Internal Server Error."
        })
    }
}


// @desc    Verify OTP and complete registration (Step 2)
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtpAndRegister = async (req, res) => {
    const { email, otp } = req.body

    try {
        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and verification code are required."
            })
        }

        // Find the OTP record
        const otpRecord = await Otp.findOne({ email })

        if (!otpRecord) {
            return res.status(400).json({
                message: "Verification code has expired. Please request a new one."
            })
        }

        // Compare OTP
        const isValid = await otpRecord.compareOtp(otp)

        if (!isValid) {
            return res.status(400).json({
                message: "Invalid verification code. Please try again."
            })
        }

        // Check again that user doesn't already exist (race condition guard)
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            await Otp.deleteMany({ email })
            return res.status(400).json({
                message: "An account with this email already exists."
            })
        }

        // Create the user with stored registration data
        const newUser = await User.create({
            name: otpRecord.name,
            email: otpRecord.email,
            password: otpRecord.password,
        })

        // Clean up OTP records
        await Otp.deleteMany({ email })

        // Send welcome email (fire and forget)
        sendMail(
            email,
            'Welcome to TaskFlow!',
            welcomeEmailTemplate(otpRecord.name)
        ).catch((err) => console.error('Welcome email error:', err))

        return res.status(201).json({
            message: "Account verified and created successfully."
        })

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: Object.values(error.errors)[0].message
            })
        }

        if (error.code === 11000) {
            return res.status(400).json({
                message: "An account with this email already exists."
            })
        }

        console.error('Verify OTP error:', error)
        return res.status(500).json({
            message: "Internal Server Error."
        })
    }
}


// @desc    Register a new user (legacy — kept for backward compatibility)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {

    const { name, email, password } = req.body

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
        if (error.code === 11000) {
            return res.status(400).json({
                message: "An account with email is already exist."
            })
        }
        //checks for empty field, password and email validation
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


export const login = async (req, res) => {
    const { email, password } = req.body

    try {

        if (!email || !password) {
            return res.status(400).json({
                message: "Provide both email and password."
            })
        }


        const user = await User.findOne({ email })

        //compares using bcrypt
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                message: "Invalid email or password."
            })
        }

        // sets cookie for authentication using a jwt utiliy
        generateTokenAndSetCookie(res, user._id)

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

export const logout = async (req, res) => {

    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })

    return res.status(200).json({
        message: "User Logged Out."
    })

}

export const me = async (req, res) => {
    return res.status(200).json({
        user: req.user
    })
}
