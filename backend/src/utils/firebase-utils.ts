import { getFirestoreDB } from '../config/firebase';
import { Timestamp } from 'firebase-admin/firestore';
import {
    FirestoreDocument,
    Trip,
    Receipt,
    User
} from '../types/firestore';

// Query 관련 타입 정의
export interface QueryCondition {
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'not-in' | 'array-contains' | 'array-contains-any';
    value: any;
}

export interface QueryOptions {
    conditions?: QueryCondition[];
    orderBy?: {
        field: string;
        direction: 'asc' | 'desc';
    };
    limit?: number;
}

// 기본 CRUD 함수들
export const firebaseUtils = {
    // 문서 생성
    async createDocument<T extends FirestoreDocument>(
        collectionName: string,
        data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<string> {
        const db = getFirestoreDB();
        const docData = {
            ...data,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        const docRef = await db.collection(collectionName).add(docData);
        return docRef.id;
    },

    // 문서 조회
    async getDocument<T extends FirestoreDocument>(
        collectionName: string,
        documentId: string
    ): Promise<T | null> {
        const db = getFirestoreDB();
        const docRef = db.collection(collectionName).doc(documentId);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            return { id: docSnap.id, ...docSnap.data() } as T;
        }
        return null;
    },

    // 문서 업데이트
    async updateDocument<T extends FirestoreDocument>(
        collectionName: string,
        documentId: string,
        data: Partial<Omit<T, 'id' | 'createdAt'>>
    ): Promise<void> {
        const db = getFirestoreDB();
        const docRef = db.collection(collectionName).doc(documentId);
        const updateData = {
            ...data,
            updatedAt: Timestamp.now()
        };

        await docRef.update(updateData);
    },

    // 문서 삭제
    async deleteDocument(
        collectionName: string,
        documentId: string
    ): Promise<void> {
        const db = getFirestoreDB();
        const docRef = db.collection(collectionName).doc(documentId);
        await docRef.delete();
    },

    // 컬렉션 조회
    async getCollection<T extends FirestoreDocument>(
        collectionName: string,
        options?: QueryOptions
    ): Promise<T[]> {
        const db = getFirestoreDB();
        let query: any = db.collection(collectionName);

        // 조건 추가
        if (options?.conditions) {
            options.conditions.forEach(condition => {
                query = query.where(condition.field, condition.operator, condition.value);
            });
        }

        // 정렬 추가
        if (options?.orderBy) {
            query = query.orderBy(options.orderBy.field, options.orderBy.direction);
        }

        // 제한 추가
        if (options?.limit) {
            query = query.limit(options.limit);
        }

        const querySnapshot = await query.get();
        return querySnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        })) as T[];
    }
};

// Trip 관련 함수들
export const createTrip = async (data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return await firebaseUtils.createDocument('trips', data);
};

export const getTrip = async (id: string): Promise<Trip | null> => {
    return await firebaseUtils.getDocument<Trip>('trips', id);
};

export const updateTrip = async (id: string, data: Partial<Omit<Trip, 'id' | 'createdAt'>>): Promise<void> => {
    return await firebaseUtils.updateDocument('trips', id, data);
};

export const deleteTrip = async (id: string): Promise<void> => {
    return await firebaseUtils.deleteDocument('trips', id);
};

export const getTripsByUser = async (userId: string): Promise<Trip[]> => {
    return await firebaseUtils.getCollection<Trip>('trips', {
        conditions: [{ field: 'userId', operator: '==', value: userId }],
        orderBy: { field: 'createdAt', direction: 'desc' }
    });
};

// Receipt 관련 함수들
export const createReceipt = async (data: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return await firebaseUtils.createDocument('receipts', data);
};

export const getReceipt = async (id: string): Promise<Receipt | null> => {
    return await firebaseUtils.getDocument<Receipt>('receipts', id);
};

export const updateReceipt = async (id: string, data: Partial<Omit<Receipt, 'id' | 'createdAt'>>): Promise<void> => {
    return await firebaseUtils.updateDocument('receipts', id, data);
};

export const deleteReceipt = async (id: string): Promise<void> => {
    return await firebaseUtils.deleteDocument('receipts', id);
};

export const getReceiptsByUser = async (userId: string): Promise<Receipt[]> => {
    return await firebaseUtils.getCollection<Receipt>('receipts', {
        conditions: [{ field: 'userId', operator: '==', value: userId }],
        orderBy: { field: 'date', direction: 'desc' }
    });
};

export const getReceiptsByTrip = async (tripId: string): Promise<Receipt[]> => {
    return await firebaseUtils.getCollection<Receipt>('receipts', {
        conditions: [{ field: 'tripId', operator: '==', value: tripId }],
        orderBy: { field: 'date', direction: 'desc' }
    });
};

// User 관련 함수들
export const createUser = async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return await firebaseUtils.createDocument('users', data);
};

export const getUser = async (id: string): Promise<User | null> => {
    return await firebaseUtils.getDocument<User>('users', id);
};

export const updateUser = async (id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<void> => {
    return await firebaseUtils.updateDocument('users', id, data);
};

export const deleteUser = async (id: string): Promise<void> => {
    return await firebaseUtils.deleteDocument('users', id);
};

export const getUsers = async (): Promise<User[]> => {
    return await firebaseUtils.getCollection<User>('users');
};

// 카테고리 색상 매핑
const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
        'food': '#FF6B6B',
        'transport': '#4ECDC4',
        'accommodation': '#45B7D1',
        'shopping': '#96CEB4',
        'entertainment': '#FFEAA7',
        '기타': '#DDA0DD'
    };
    return colors[category] || '#DDA0DD';
};

// 통계 계산 함수
export const calculateTripStats = async (tripId: string) => {
    const receipts = await getReceiptsByTrip(tripId);

    const totalAmount = receipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0);
    const receiptCount = receipts.length;
    const dailyAverage = receiptCount > 0 ? totalAmount / receiptCount : 0;

    // 카테고리별 통계
    const categoryStats = receipts.reduce((acc, receipt) => {
        const category = receipt.category || '기타';
        acc[category] = (acc[category] || 0) + (receipt.total || 0);
        return acc;
    }, {} as Record<string, number>);

    const categories = Object.entries(categoryStats).map(([name, amount]) => ({
        name,
        amount,
        percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
        color: getCategoryColor(name)
    })).sort((a, b) => b.amount - a.amount);

    return {
        totalAmount,
        receiptCount,
        dailyAverage,
        categories
    };
};
