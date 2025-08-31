import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    DocumentData,
    QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import {
    FirestoreDocument,
    Trip,
    Receipt,
    User,
    QueryCondition,
    QueryOptions,
    ApiResponse
} from '../types/firestore';

// 기본 CRUD 함수들
export const firebaseUtils = {
    // 문서 생성
    async createDocument<T extends FirestoreDocument>(
        collectionName: string,
        data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<string> {
        const docData = {
            ...data,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        const docRef = await addDoc(collection(db, collectionName), docData);
        return docRef.id;
    },

    // 문서 조회
    async getDocument<T extends FirestoreDocument>(
        collectionName: string,
        documentId: string
    ): Promise<T | null> {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
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
        const docRef = doc(db, collectionName, documentId);
        const updateData = {
            ...data,
            updatedAt: Timestamp.now()
        };

        await updateDoc(docRef, updateData);
    },

    // 문서 삭제
    async deleteDocument(
        collectionName: string,
        documentId: string
    ): Promise<void> {
        const docRef = doc(db, collectionName, documentId);
        await deleteDoc(docRef);
    },

    // 컬렉션 조회
    async getCollection<T extends FirestoreDocument>(
        collectionName: string,
        conditions?: Array<{ field: string; operator: any; value: any }>,
        orderByField?: string,
        orderDirection: 'asc' | 'desc' = 'desc',
        limitCount?: number
    ): Promise<T[]> {
        let q = collection(db, collectionName);

        // 조건 추가
        if (conditions && conditions.length > 0) {
            conditions.forEach(condition => {
                q = query(q, where(condition.field, condition.operator, condition.value));
            });
        }

        // 정렬 추가
        if (orderByField) {
            q = query(q, orderBy(orderByField, orderDirection));
        }

        // 제한 추가
        if (limitCount) {
            q = query(q, limit(limitCount));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as T[];
    },

    // 실시간 리스너 (옵션)
    subscribeToCollection<T extends FirestoreDocument>(
        collectionName: string,
        callback: (documents: T[]) => void,
        conditions?: Array<{ field: string; operator: any; value: any }>
    ) {
        // 실시간 리스너 구현은 필요에 따라 추가
        // onSnapshot 사용
    }
};

// 타입 안전성을 위한 제네릭 함수들
export const createTrip = (data: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) =>
    firebaseUtils.createDocument<Trip>('trips', data);
export const getTrip = (id: string) => firebaseUtils.getDocument<Trip>('trips', id);
export const updateTrip = (id: string, data: Partial<Omit<Trip, 'id' | 'createdAt'>>) =>
    firebaseUtils.updateDocument<Trip>('trips', id, data);
export const deleteTrip = (id: string) => firebaseUtils.deleteDocument('trips', id);
export const getTrips = (options?: QueryOptions) =>
    firebaseUtils.getCollection<Trip>('trips', options?.conditions, options?.orderBy?.field, options?.orderBy?.direction, options?.limit);

export const createReceipt = (data: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>) =>
    firebaseUtils.createDocument<Receipt>('receipts', data);
export const getReceipt = (id: string) => firebaseUtils.getDocument<Receipt>('receipts', id);
export const updateReceipt = (id: string, data: Partial<Omit<Receipt, 'id' | 'createdAt'>>) =>
    firebaseUtils.updateDocument<Receipt>('receipts', id, data);
export const deleteReceipt = (id: string) => firebaseUtils.deleteDocument('receipts', id);
export const getReceipts = (options?: QueryOptions) =>
    firebaseUtils.getCollection<Receipt>('receipts', options?.conditions, options?.orderBy?.field, options?.orderBy?.direction, options?.limit);

export const createUser = (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) =>
    firebaseUtils.createDocument<User>('users', data);
export const getUser = (id: string) => firebaseUtils.getDocument<User>('users', id);
export const updateUser = (id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>) =>
    firebaseUtils.updateDocument<User>('users', id, data);
export const deleteUser = (id: string) => firebaseUtils.deleteDocument('users', id);
export const getUsers = (options?: QueryOptions) =>
    firebaseUtils.getCollection<User>('users', options?.conditions, options?.orderBy?.field, options?.orderBy?.direction, options?.limit);

// 특화된 쿼리 함수들
export const getTripsByUser = (userId: string) =>
    getTrips({ conditions: [{ field: 'userId', operator: '==', value: userId }] });

export const getReceiptsByTrip = (tripId: string) =>
    getReceipts({
        conditions: [{ field: 'tripId', operator: '==', value: tripId }],
        orderBy: { field: 'date', direction: 'desc' }
    });

export const getReceiptsByUser = (userId: string) =>
    getReceipts({
        conditions: [{ field: 'userId', operator: '==', value: userId }],
        orderBy: { field: 'date', direction: 'desc' }
    });

// 통계 계산 함수들
export const calculateTripStats = async (tripId: string): Promise<any> => {
    const receipts = await getReceiptsByTrip(tripId);

    const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    const receiptCount = receipts.length;

    // 카테고리별 집계
    const categoryMap = new Map<string, number>();
    receipts.forEach(receipt => {
        const current = categoryMap.get(receipt.category) || 0;
        categoryMap.set(receipt.category, current + receipt.amount);
    });

    const categories = Array.from(categoryMap.entries()).map(([name, amount]) => ({
        name,
        amount,
        percentage: (amount / totalAmount) * 100,
        color: getCategoryColor(name)
    }));

    return {
        totalAmount,
        receiptCount,
        categories,
        dailyAverage: totalAmount / Math.max(receiptCount, 1)
    };
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
