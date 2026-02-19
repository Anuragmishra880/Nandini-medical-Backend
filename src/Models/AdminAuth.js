import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const adminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },
    password: {
        type: String,
        required: true,

    },
     adminImage: {
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        enum: ["admin", "seller"],
        default: "admin"
    },
    refreshToken: {
        type: String,
    },

},
    {
        timestamps: true
    }
);
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}
adminSchema.methods.generateAccessToken =function () {
    return  jwt.sign(
        {
            id: this._id,
            adminName: this.adminName,
            email: this.email,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}
adminSchema.methods.generateRefreshToken = function () {
    return  jwt.sign(
        {
            id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}
export const Admin = mongoose.model("Admin", adminSchema);
