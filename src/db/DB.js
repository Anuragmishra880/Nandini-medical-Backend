import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'
// const mongoURL = 'mongodb://127.0.0.1:27017/Nandini_Medical'

const connectDB = async () => {
    try {
        if (!process.env.mongoURI) {
            console.error("MONGO_URI not set. Skipping MongoDB connection.");
            return;
        }
        const connectionInstance = await mongoose.connect(`${process.env.mongoURI}/${DB_NAME}`)

        console.log(`\n MongoDB connected !! DB Host${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('mongoDB connection Error', error)
        process.exit(1)
    }
}
export default connectDB
// mongoose.connect(mongoURL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

// const DB = mongoose.connection;
// DB.on("connected", () => {
//     console.log("connected to MongoDB database")
// })
// DB.on("error", () => {
//     console.log("An error occurred in MongoDB database")
// })
// DB.on("disconnected", () => {
//     console.log("Disconnected to MongoDB database")
// })
// module.exports = DB;

