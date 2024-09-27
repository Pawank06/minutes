// db/connectdb.ts
import mongoose from "mongoose";

const connectDB = async () => {
    // Check if already connected to avoid multiple connections
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(`Successfully connected to MongoDB`);
    } catch (error: unknown) {
        // Use 'unknown' for better type safety
        if (error instanceof Error) {
            console.error(`Error while connecting to db: ${error.message}`);
        } else {
            console.error('Error while connecting to db:', error);
        }
    }
};

export default connectDB;
