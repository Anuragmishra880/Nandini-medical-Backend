import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { app } from './app.js'
import connectDB from './db/DB.js'

app.use(express.json())
const PORT = process.env.PORT || 5000;
connectDB()
app.use('/public', express.static('public'))
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})

