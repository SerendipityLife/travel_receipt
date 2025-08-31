import express from 'express';
import {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  addReceipt,
  updateBudget
} from '../controllers/tripController';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Trip routes
router.get('/', getTrips);
router.get('/:id', getTrip);
router.post('/', createTrip);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

// Receipt routes
router.post('/:id/receipts', addReceipt);

// Budget routes
router.put('/:id/budget', updateBudget);

export default router;
