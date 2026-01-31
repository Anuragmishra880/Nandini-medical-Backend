import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
// it is uses for accept data from forms
app.use(express.json({ limit: '16kb' }))

// it is uses for accept data from URL
// app.use(express.urlencoded({ extended: true, limit: '16kb' })) 
app.use(express.urlencoded())


app.use(express.static('public'))
app.use(cookieParser())

// Routes import
import userRouter from './Routes/User.Routes.js'
// routes declaration
app.use('/api/v1/users',userRouter)

export { app }