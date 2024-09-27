/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string)
        console.log(`Successfully connected to MongoDB`)
    } catch (error: any) {
        console.error(`Error while connecting to db: ${error.message}`)
    }
}

export default connectDB