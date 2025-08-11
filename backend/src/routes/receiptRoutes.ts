import express from 'express';
import { auth } from '../middleware/auth';

const router = express.Router();

// Placeholder for receipt routes
router.get('/', auth, (req, res) => {
  res.json({ message: 'Receipt routes' });
});

export default router;
