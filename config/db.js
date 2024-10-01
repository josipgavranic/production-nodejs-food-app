import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected: ${mongoose.connection.host}`.bgGreen.white);
    } 
    catch (error) {
        console.log(`MongoDB Error: ${error.message}`.bgRed.white);
    }
};

export default connectDB;
