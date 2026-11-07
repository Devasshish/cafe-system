import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api/docs`);
});

// Connect to Database
if (process.env.MONGO_URI) {
  connectDB();
}
