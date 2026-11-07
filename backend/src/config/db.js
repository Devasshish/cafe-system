import mongoose from 'mongoose';

const connectDB = async () => {
  let uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.error('MongoDB Error: MONGODB_URI environment variable is not defined.');
    return;
  }

  // Sanitize any accidental duplicated protocol prefix
  if (uri.startsWith('mongodb://mongodb+srv://')) {
    uri = uri.replace('mongodb://mongodb+srv://', 'mongodb+srv://');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // Sanitize any credentials if error message contains URI
    const sanitizedMsg = error.message.replace(/:([^:@]{1,})@/, ':****@');
    console.error(`MongoDB Connection Error: ${sanitizedMsg}`);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Connection event listeners
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB connection lost. Reconnecting...');
});

mongoose.connection.on('error', (err) => {
  const sanitizedMsg = err.message.replace(/:([^:@]{1,})@/, ':****@');
  console.error(`MongoDB runtime error: ${sanitizedMsg}`);
});

export default connectDB;
