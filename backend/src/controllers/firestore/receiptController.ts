import { Response } from 'express';
import { RequestWithUser } from '../../types/request';
import { Receipt, Trip } from '../../types/firestore';
import { 
    createReceipt, 
    getReceipt, 
    updateReceipt, 
    deleteReceipt, 
    getReceiptsByUser,
    getReceiptsByTrip,
    getTrip,
    updateTrip,
    calculateTripStats
} from '../../utils/firebase-utils';
import { Timestamp } from 'firebase-admin/firestore';

// Get all receipts for a user
export const getReceipts = async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const receipts = await getReceiptsByUser(userId);
        return res.json(receipts);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Get receipts by trip
export const getReceiptsByTripId = async (req: RequestWithUser, res: Response) => {
    try {
        const { tripId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // 여행 권한 확인
        const trip = await getTrip(tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        if (trip.userId !== userId && !trip.members.find(m => m.userId === userId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const receipts = await getReceiptsByTrip(tripId);
        return res.json(receipts);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Get single receipt
export const getReceiptById = async (req: RequestWithUser, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const receipt = await getReceipt(id);
        if (!receipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }

        // 권한 확인
        if (receipt.userId !== userId) {
            // 여행 멤버인지 확인
            if (receipt.tripId) {
                const trip = await getTrip(receipt.tripId);
                if (!trip || !trip.members.find(m => m.userId === userId)) {
                    return res.status(403).json({ message: 'Access denied' });
                }
            } else {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        return res.json(receipt);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Create new receipt
export const createNewReceipt = async (req: RequestWithUser, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const receiptData: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'> = {
            userId,
            tripId: req.body.tripId,
            title: req.body.title,
            storeName: req.body.storeName,
            storeNameKr: req.body.storeNameKr,
            location: req.body.location,
            date: Timestamp.fromDate(new Date(req.body.date)),
            amount: req.body.amount,
            currency: req.body.currency || 'KRW',
            exchangeRate: req.body.exchangeRate,
            amountKr: req.body.amountKr,
            category: req.body.category || '기타',
            tags: req.body.tags || [],
            notes: req.body.notes,

            receiptDetails: req.body.receiptDetails ? {
                receiptNo: req.body.receiptDetails.receiptNo,
                cashierNo: req.body.receiptDetails.cashierNo,
                tel: req.body.receiptDetails.tel,
                address: req.body.receiptDetails.address,
                addressKr: req.body.receiptDetails.addressKr,
                time: req.body.receiptDetails.time,
                paymentMethod: req.body.receiptDetails.paymentMethod,
                paymentMethodKr: req.body.receiptDetails.paymentMethodKr,
                change: req.body.receiptDetails.change,
                changeKr: req.body.receiptDetails.changeKr
            } : undefined,

            items: req.body.items?.map((item: any) => ({
                code: item.code,
                name: item.name,
                nameKr: item.nameKr,
                price: item.price,
                priceKr: item.priceKr,
                quantity: item.quantity,
                tax: item.tax
            })),

            subtotal: req.body.subtotal,
            subtotalKr: req.body.subtotalKr,
            tax: req.body.tax,
            taxKr: req.body.taxKr,
            total: req.body.total,
            totalKr: req.body.totalKr,

            imageUrl: req.body.imageUrl,
            imageThumbnailUrl: req.body.imageThumbnailUrl,

            ocrProcessed: req.body.ocrProcessed || false,
            ocrConfidence: req.body.ocrConfidence
        };

        const receiptId = await createReceipt(receiptData);
        const createdReceipt = await getReceipt(receiptId);

        // 여행 통계 업데이트
        if (receiptData.tripId) {
            await updateTripStats(receiptData.tripId);
        }

        return res.status(201).json(createdReceipt);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Update receipt
export const updateReceiptById = async (req: RequestWithUser, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const existingReceipt = await getReceipt(id);
        if (!existingReceipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }

        // 권한 확인
        if (existingReceipt.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updateData: Partial<Omit<Receipt, 'id' | 'createdAt'>> = {};

        // 업데이트할 필드들만 포함
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.storeName !== undefined) updateData.storeName = req.body.storeName;
        if (req.body.storeNameKr !== undefined) updateData.storeNameKr = req.body.storeNameKr;
        if (req.body.location !== undefined) updateData.location = req.body.location;
        if (req.body.date !== undefined) updateData.date = Timestamp.fromDate(new Date(req.body.date));
        if (req.body.amount !== undefined) updateData.amount = req.body.amount;
        if (req.body.currency !== undefined) updateData.currency = req.body.currency;
        if (req.body.exchangeRate !== undefined) updateData.exchangeRate = req.body.exchangeRate;
        if (req.body.amountKr !== undefined) updateData.amountKr = req.body.amountKr;
        if (req.body.category !== undefined) updateData.category = req.body.category;
        if (req.body.tags !== undefined) updateData.tags = req.body.tags;
        if (req.body.notes !== undefined) updateData.notes = req.body.notes;
        if (req.body.receiptDetails !== undefined) updateData.receiptDetails = req.body.receiptDetails;
        if (req.body.items !== undefined) updateData.items = req.body.items;
        if (req.body.subtotal !== undefined) updateData.subtotal = req.body.subtotal;
        if (req.body.subtotalKr !== undefined) updateData.subtotalKr = req.body.subtotalKr;
        if (req.body.tax !== undefined) updateData.tax = req.body.tax;
        if (req.body.taxKr !== undefined) updateData.taxKr = req.body.taxKr;
        if (req.body.total !== undefined) updateData.total = req.body.total;
        if (req.body.totalKr !== undefined) updateData.totalKr = req.body.totalKr;
        if (req.body.imageUrl !== undefined) updateData.imageUrl = req.body.imageUrl;
        if (req.body.imageThumbnailUrl !== undefined) updateData.imageThumbnailUrl = req.body.imageThumbnailUrl;
        if (req.body.ocrProcessed !== undefined) updateData.ocrProcessed = req.body.ocrProcessed;
        if (req.body.ocrConfidence !== undefined) updateData.ocrConfidence = req.body.ocrConfidence;

        await updateReceipt(id, updateData);
        const updatedReceipt = await getReceipt(id);

        // 여행 통계 업데이트
        if (updatedReceipt && updatedReceipt.tripId) {
            await updateTripStats(updatedReceipt.tripId);
        }

        return res.json(updatedReceipt);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Delete receipt
export const deleteReceiptById = async (req: RequestWithUser, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const receipt = await getReceipt(id);
        if (!receipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }

        // 권한 확인
        if (receipt.userId !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const tripId = receipt.tripId;
        await deleteReceipt(id);

        // 여행 통계 업데이트
        if (tripId) {
            await updateTripStats(tripId);
        }

        return res.json({ message: 'Receipt deleted successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Get receipts by category
export const getReceiptsByCategory = async (req: RequestWithUser, res: Response) => {
    try {
        const { category } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const receipts = await getReceiptsByUser(userId);
        const filteredReceipts = receipts.filter(receipt => receipt.category === category);

        return res.json(receipts);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Get receipts by date range
export const getReceiptsByDateRange = async (req: RequestWithUser, res: Response) => {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        const startTimestamp = Timestamp.fromDate(new Date(startDate as string));
        const endTimestamp = Timestamp.fromDate(new Date(endDate as string));

        const receipts = await getReceiptsByUser(userId);
        const filteredReceipts = receipts.filter(receipt => {
            let receiptDate: Date;
            if (receipt.date instanceof Date) {
                receiptDate = receipt.date;
            } else if (receipt.date && typeof receipt.date.toDate === 'function') {
                receiptDate = receipt.date.toDate();
            } else {
                receiptDate = new Date(receipt.date.toString());
            }
            return receiptDate >= startTimestamp.toDate() && receiptDate <= endTimestamp.toDate();
        });

        return res.json(receipts);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return res.status(500).json({ message: 'Server error', error: errorMessage });
    }
};

// Helper function to update trip statistics
const updateTripStats = async (tripId: string) => {
    try {
        const stats = await calculateTripStats(tripId);
        const trip = await getTrip(tripId);

        if (trip) {
            await updateTrip(tripId, {
                stats: {
                    totalAmount: stats.totalAmount,
                    receiptCount: stats.receiptCount,
                    days: trip.stats.days,
                    dailyAverage: stats.dailyAverage
                },
                budget: {
                    ...trip.budget,
                    spent: stats.totalAmount,
                    remaining: trip.budget.total - stats.totalAmount
                },
                categories: stats.categories
            });
        }
    } catch (error) {
        console.error('Error updating trip stats:', error);
    }
};
