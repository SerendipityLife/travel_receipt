import { Response } from 'express';
import { RequestWithUser } from '../../types/request';
import { User, UserSettings } from '../../types/firestore';
import {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getUsers
} from '../../utils/firebase-utils';
import { getFirebaseAuth } from '../../config/firebase';

// Get user profile
export const getUserProfile = async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await getUser(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 민감한 정보 제거
        const { ...userProfile } = user;
        return res.json(userProfile);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Update user profile
export const updateUserProfile = async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const existingUser = await getUser(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updateData: Partial<Omit<User, 'id' | 'createdAt'>> = {};

        // 업데이트할 필드들만 포함
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.avatar !== undefined) updateData.avatar = req.body.avatar;
        if (req.body.preferences !== undefined) {
            updateData.preferences = {
                ...existingUser.preferences,
                ...req.body.preferences
            };
        }

        await updateUser(userId, updateData);
        const updatedUser = await getUser(userId);

        // 민감한 정보 제거
        const { ...userProfile } = updatedUser;
        return res.json(userProfile);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Create user profile (Firebase Auth와 연동)
export const createUserProfile = async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // 이미 존재하는지 확인
        const existingUser = await getUser(userId);
        if (existingUser) {
            return res.status(400).json({ message: 'User profile already exists' });
        }

        const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
            email: req.body.email || req.user?.email || '',
            name: req.body.name || req.user?.name || 'Unknown',
            avatar: req.body.avatar,
            preferences: {
                currency: req.body.preferences?.currency || 'KRW',
                language: req.body.preferences?.language || 'ko',
                notifications: req.body.preferences?.notifications !== false
            }
        };

        await createUser(userData);
        const createdUser = await getUser(userId);

        // 민감한 정보 제거
        const { ...userProfile } = createdUser;
        return res.status(201).json(userProfile);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Delete user profile
export const deleteUserProfile = async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await getUser(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await deleteUser(userId);
        return res.json({ message: 'User profile deleted successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Get user settings
export const getUserSettings = async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // UserSettings 컬렉션에서 조회 (별도 컬렉션)
        const settings = await getUser(userId); // 임시로 users 컬렉션에서 조회
        if (!settings) {
            return res.status(404).json({ message: 'User settings not found' });
        }

        return res.json(settings.preferences);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Update user settings
export const updateUserSettings = async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const user = await getUser(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updateData: Partial<Omit<User, 'id' | 'createdAt'>> = {
            preferences: {
                ...user.preferences,
                ...req.body
            }
        };

        await updateUser(userId, updateData);
        const updatedUser = await getUser(userId);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found after update' });
        }

        return res.json(updatedUser.preferences);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Get user statistics
export const getUserStats = async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // 사용자 통계 계산 (여행 수, 영수증 수, 총 지출 등)
        const user = await getUser(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 임시 통계 데이터 (실제로는 trips, receipts 컬렉션에서 집계)
        const stats = {
            totalTrips: 0,
            totalReceipts: 0,
            totalSpent: 0,
            averagePerTrip: 0,
            favoriteCategory: '기타',
            lastTripDate: null
        };

        return res.json(stats);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Verify Firebase token
export const verifyToken = async (req: RequestWithUser, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];
        const auth = getFirebaseAuth();

        const decodedToken = await auth.verifyIdToken(token);

        return res.json({
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(401).json({ message: 'Invalid token', error: errorMessage });
    }
};
