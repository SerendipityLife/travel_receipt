import { Response } from 'express';
import { RequestWithUser } from '../../types/request';
import { Trip } from '../../types/firestore';
import {
    createTrip,
    getTrip,
    updateTrip,
    deleteTrip,
    getTripsByUser,
    calculateTripStats
} from '../../utils/firebase-utils';
import { Timestamp } from 'firebase-admin/firestore';

// Get all trips for a user
export const getTrips = async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const trips = await getTripsByUser(userId);
        return res.json(trips);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Get single trip
export const getTripById = async (req: RequestWithUser, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const trip = await getTrip(id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // 권한 확인
        if (trip.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        return res.json(trip);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Create new trip
export const createNewTrip = async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'> = {
            userId,
            title: req.body.title,
            description: req.body.description,
            startDate: Timestamp.fromDate(new Date(req.body.startDate + 'T00:00:00')),
            endDate: Timestamp.fromDate(new Date(req.body.endDate + 'T00:00:00')),
            location: req.body.location,
            status: req.body.status || 'active',

            budget: {
                total: req.body.budget?.total || 0,
                currency: req.body.budget?.currency || 'KRW',
                spent: 0,
                remaining: req.body.budget?.total || 0
            },

            stats: {
                totalAmount: 0,
                receiptCount: 0,
                days: Math.ceil((new Date(req.body.endDate + 'T00:00:00').getTime() - new Date(req.body.startDate + 'T00:00:00').getTime()) / (1000 * 60 * 60 * 24)) + 1,
                dailyAverage: 0
            },

            categories: [],
            members: [{
                userId,
                name: req.user?.name || 'Unknown',
                avatar: req.user?.avatar,
                role: 'owner',
                joinedAt: Timestamp.now()
            }],
            sharedExpenses: []
        };

        const tripId = await createTrip(tripData);
        const createdTrip = await getTrip(tripId);

        return res.status(201).json(createdTrip);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Update trip
export const updateTripById = async (req: RequestWithUser, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const existingTrip = await getTrip(id);
        if (!existingTrip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // 권한 확인
        if (existingTrip.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updateData: Partial<Omit<Trip, 'id' | 'createdAt'>> = {};

        // 업데이트할 필드들만 포함
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.startDate !== undefined) updateData.startDate = Timestamp.fromDate(new Date(req.body.startDate));
        if (req.body.endDate !== undefined) updateData.endDate = Timestamp.fromDate(new Date(req.body.endDate));
        if (req.body.location !== undefined) updateData.location = req.body.location;
        if (req.body.status !== undefined) updateData.status = req.body.status;

        if (req.body.budget !== undefined) {
            updateData.budget = {
                ...existingTrip.budget,
                ...req.body.budget,
                remaining: (req.body.budget.total || existingTrip.budget.total) - existingTrip.budget.spent
            };
        }

        await updateTrip(id, updateData);
        const updatedTrip = await getTrip(id);

        return res.json(updatedTrip);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Delete trip
export const deleteTripById = async (req: RequestWithUser, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const trip = await getTrip(id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // 권한 확인
        if (trip.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await deleteTrip(id);
        return res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Get trip statistics
export const getTripStats = async (req: RequestWithUser, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const trip = await getTrip(id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // 권한 확인
        if (trip.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const stats = await calculateTripStats(id);
        return res.json(stats);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Add member to trip
export const addTripMember = async (req: RequestWithUser, res: Response) => {
    try {
        const { id } = req.params;
        const { memberId, memberName, memberAvatar } = req.body;
        const userId = req.user?.id;

        const trip = await getTrip(id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // 권한 확인 (소유자만 멤버 추가 가능)
        if (trip.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // 이미 멤버인지 확인
        const existingMember = trip.members.find(m => m.userId === memberId);
        if (existingMember) {
            return res.status(400).json({ message: 'Member already exists' });
        }

        const newMember = {
            userId: memberId,
            name: memberName,
            avatar: memberAvatar,
            role: 'member' as const,
            joinedAt: Timestamp.now()
        };

        const updatedMembers = [...trip.members, newMember];
        await updateTrip(id, { members: updatedMembers });

        const updatedTrip = await getTrip(id);
        return res.json(updatedTrip);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Remove member from trip
export const removeTripMember = async (req: RequestWithUser, res: Response) => {
    try {
        const { id, memberId } = req.params;
        const userId = req.user?.id;

        const trip = await getTrip(id);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // 권한 확인 (소유자만 멤버 제거 가능)
        if (trip.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // 소유자는 제거할 수 없음
        if (memberId === trip.userId) {
            return res.status(400).json({ message: 'Cannot remove trip owner' });
        }

        const updatedMembers = trip.members.filter(m => m.userId !== memberId);
        await updateTrip(id, { members: updatedMembers });

        const updatedTrip = await getTrip(id);
        return res.json(updatedTrip);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};
