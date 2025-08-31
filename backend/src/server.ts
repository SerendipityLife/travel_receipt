import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Firebase 초기화
import initializeFirebaseAdmin from './config/firebase';

// Firestore Routes (Firebase 기반 API)
import firestoreTripRoutes from './routes/firestore/tripRoutes';
import firestoreReceiptRoutes from './routes/firestore/receiptRoutes';
import firestoreUserRoutes from './routes/firestore/userRoutes';
import firestoreOcrRoutes from './routes/firestore/ocrRoutes';

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

// Firestore Routes (Firebase 기반 API)
app.use('/api/firestore/trips', firestoreTripRoutes);
app.use('/api/firestore/receipts', firestoreReceiptRoutes);
app.use('/api/firestore/users', firestoreUserRoutes);
app.use('/api/firestore/ocr', firestoreOcrRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Start server
const startServer = () => {
  // Firebase 초기화
  initializeFirebaseAdmin();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Firebase Admin SDK initialized`);
  });
};

startServer();
