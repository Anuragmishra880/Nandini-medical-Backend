// import { AdminCreator } from './utils/AdminCreation.js'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
// it is uses for accept data from forms
app.use(express.json({ limit: '16kb' }))
// it is uses for accept data from URL
// app.use(express.urlencoded({ extended: true, limit: '16kb' })) 
app.use(express.urlencoded())

app.use(express.static('public'))
app.use(cookieParser())

// Routes import
import userRouter from './Routes/User.Routes.js'
import productRouter from './Routes/ProductRoute.js'
import adminRouter from './Routes/Admin.route.js'
import cartRouter from './Routes/CartRoutes.js'
// routes declaration
app.use('/api/v1/users', userRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/cart', cartRouter)
export { app }