import express from 'express'
const router = express.Router()
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {User} from '../Models/User.js'
import { registerUser } from '../Controllers/user.controller.js'
router.route('/register').post(registerUser)

router.post('/signUp', async (req, res) => {
    const { username, email, password } = req.body
    try {
        if (userExists)
            return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = new user({ username, email, password: hashedPassword })
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        ); res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
        // await user.save()
        res.json({ message: "User registered successfully" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
});

// Login

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: "User not found" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ error: "Invalid Password" });
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
})

export default  router