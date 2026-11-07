import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB not connected: ${error.message}`);
    console.log('Server is running without MongoDB. Set a valid MONGO_URI in .env when available.');
  }
};

export default connectDB;
