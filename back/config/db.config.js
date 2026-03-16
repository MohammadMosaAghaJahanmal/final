import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI)
        const conn = await mongoose.connect(process.env.MONGO_URI);
        if(conn.connection.readyState === 1) {  
            console.log("MongoDB connected successfully");
        }
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}
