import { Request, Response } from 'express';
import Trip, { ITrip } from '../models/Trip';

// Get all trips for a user
export const getTrips = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const trips = await Trip.find({ userId }).sort({ createdAt: -1 });
    return res.json(trips);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Get single trip
export const getTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const trip = await Trip.findOne({ _id: id, userId });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.json(trip);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Create new trip
export const createTrip = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const tripData = {
      ...req.body,
      userId
    };

    const trip = new Trip(tripData);
    await trip.save();

    return res.status(201).json(trip);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Update trip
export const updateTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const trip = await Trip.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.json(trip);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Delete trip
export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const trip = await Trip.findOneAndDelete({ _id: id, userId });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Add receipt to trip
export const addReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { receipt } = req.body;
    const userId = req.user?.id;

    const trip = await Trip.findOne({ _id: id, userId });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    trip.receipts.push(receipt);
    trip.totalAmount += receipt.amount;
    trip.receiptCount = trip.receipts.length;
    trip.expenses.totalSpent += receipt.amount;
    trip.expenses.receipts = trip.receipts.length;

    await trip.save();
    return res.json(trip);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};

// Update trip budget
export const updateBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { budget } = req.body;
    const userId = req.user?.id;

    const trip = await Trip.findOne({ _id: id, userId });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    trip.budget = { ...trip.budget, ...budget };
    trip.budget.remaining = trip.budget.total - trip.budget.spent;

    await trip.save();
    return res.json(trip);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Server error', error: errorMessage });
  }
};
