import mongoose from 'mongoose'

// const mongoURL = 'mongodb://127.0.0.1:27017/Nandini_Medical'

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI not set. Skipping MongoDB connection.");
            return;
        }
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`)

        console.log(`\n MongoDB connected !! DB Host${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('mongoDB connection Error', error)
        process.exit(1)
    }
}
export default connectDB

