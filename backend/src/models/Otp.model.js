import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  // Temporarily store registration data so user doesn't re-submit
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // TTL: auto-delete after 10 minutes
  },
})

// Hash OTP before saving
otpSchema.pre('save', async function () {
  if (!this.isModified('otp')) return
  const salt = await bcrypt.genSalt(10)
  this.otp = await bcrypt.hash(this.otp, salt)
})

// Compare plain OTP against hashed
otpSchema.methods.compareOtp = async function (plainOtp) {
  return await bcrypt.compare(plainOtp, this.otp)
}

const Otp = mongoose.model('Otp', otpSchema)

export default Otp
