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
const PORT = Number(process.env.PORT) || 5001;

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
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 1000,
    } as any);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error instanceof Error ? error.message : error);
    console.log('Continuing without database connection...');
  }
};

// Start server
const startServer = () => {
  // Fire-and-forget DB connection so server can start immediately
  void connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
