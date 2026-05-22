import mongoose from "mongoose"
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true,'Provide your full name'],
            trim: true,
            maxlength: [50,'Name cannot exceed 50 characters']
        },

        email: {
            type: String,
            required: [true,'Provide an email address'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Provide an valid email address'
            ]
        },

        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [8, 'Password must be at least 8 characters long'],
            validate: {
                validator: function(value) {
                    const regPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                    return regPass.test(value)
                },
                message: "Password is too weak. It must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
                
            }
        }
    },
    {
        timestamps: true
    }
)

//pass encryption using bcrypt
userSchema.pre('save', async function () {
    
    const user = this
    
    if(!user.isModified('password')) {
        return
    }
    
        const salt = await bcrypt.genSalt(10)
        
        user.password = await bcrypt.hash(user.password, salt)        
})

userSchema.methods.comparePassword = async function (plain)  {
    const user = this

    return await bcrypt.compare(plain, user.password)
}


// not allowing password to pass through json response to frontend

userSchema.set('toJSON', {
    transform: function(doc, obj) {
    
        delete obj.password        
        return obj
    }
})

const User = mongoose.model('User', userSchema)

export default User