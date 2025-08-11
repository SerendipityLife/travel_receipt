import { Request, Response } from 'express';
import Receipt from '../models/Receipt';
import Trip from '../models/Trip';

// Get all receipts for a user
export const getReceipts = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const receipts = await Receipt.find({ userId }).sort({ createdAt: -1 });
    return res.json(receipts);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Get single receipt
export const getReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const receipt = await Receipt.findOne({ _id: id, userId });
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    return res.json(receipt);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Create new receipt
export const createReceipt = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const receiptData = {
      ...req.body,
      userId
    };

    const receipt = new Receipt(receiptData);
    await receipt.save();

    // Update trip budget if tripId is provided
    if (receipt.tripId) {
      const trip = await Trip.findById(receipt.tripId);
      if (trip) {
        trip.totalAmount += receipt.totalAmount;
        trip.receiptCount = (trip.receiptCount || 0) + 1;
        trip.expenses.totalSpent += receipt.totalAmount;
        trip.expenses.receipts = (trip.expenses.receipts || 0) + 1;
        trip.budget.remaining = trip.budget.total - trip.expenses.totalSpent;
        await trip.save();
      }
    }

    return res.status(201).json(receipt);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Update receipt
export const updateReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const oldReceipt = await Receipt.findOne({ _id: id, userId });
    if (!oldReceipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    const oldAmount = oldReceipt.totalAmount;
    const newAmount = req.body.totalAmount || oldAmount;

    const receipt = await Receipt.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    // Update trip budget if amount changed
    if (receipt && receipt.tripId && oldAmount !== newAmount) {
      const trip = await Trip.findById(receipt.tripId);
      if (trip) {
        trip.totalAmount = trip.totalAmount - oldAmount + newAmount;
        trip.expenses.totalSpent = trip.expenses.totalSpent - oldAmount + newAmount;
        trip.budget.remaining = trip.budget.total - trip.expenses.totalSpent;
        await trip.save();
      }
    }

    return res.json(receipt);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Delete receipt
export const deleteReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const receipt = await Receipt.findOne({ _id: id, userId });
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    // Update trip budget before deleting receipt
    if (receipt.tripId) {
      const trip = await Trip.findById(receipt.tripId);
      if (trip) {
        trip.totalAmount -= receipt.totalAmount;
        trip.receiptCount = Math.max(0, (trip.receiptCount || 0) - 1);
        trip.expenses.totalSpent -= receipt.totalAmount;
        trip.expenses.receipts = Math.max(0, (trip.expenses.receipts || 0) - 1);
        trip.budget.remaining = trip.budget.total - trip.expenses.totalSpent;
        await trip.save();
      }
    }

    await Receipt.findByIdAndDelete(id);
    return res.json({ message: 'Receipt deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};
