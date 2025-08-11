import express from 'express';
import { auth } from '../middleware/auth';
import {
  getReceipts,
  getReceipt,
  createReceipt,
  updateReceipt,
  deleteReceipt
} from '../controllers/receiptController';

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Receipt routes
router.get('/', getReceipts);
router.get('/:id', getReceipt);
router.post('/', createReceipt);
router.put('/:id', updateReceipt);
router.delete('/:id', deleteReceipt);

export default router;
