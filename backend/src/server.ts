import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes
import tripRoutes from './routes/tripRoutes';
import receiptRoutes from './routes/receiptRoutes';
import userRoutes from './routes/userRoutes';

// Middleware
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/trips', tripRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelreceipt';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Starting server without database connection...');
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.log('Database connection failed, starting server without database...');
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
