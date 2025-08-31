import { Timestamp } from 'firebase/firestore';

// 기본 Firestore 문서 인터페이스
export interface FirestoreDocument {
    id?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

// 사용자 타입
export interface User extends FirestoreDocument {
    email: string;
    name: string;
    avatar?: string;
    preferences: {
        currency: string;
        language: string;
        notifications: boolean;
    };
}

// 여행 타입
export interface Trip extends FirestoreDocument {
    userId: string;
    title: string;
    description?: string;
    startDate: Timestamp;
    endDate: Timestamp;
    location: string;
    status: 'active' | 'completed' | 'cancelled';

    // 예산 정보
    budget: {
        total: number;
        currency: string;
        spent: number;
        remaining: number;
    };

    // 통계 정보 (실시간 계산 가능)
    stats: {
        totalAmount: number;
        receiptCount: number;
        days: number;
        dailyAverage: number;
    };

    // 카테고리별 지출 (실시간 계산 가능)
    categories: Array<{
        name: string;
        amount: number;
        percentage: number;
        color: string;
    }>;

    // 멤버 정보
    members: Array<{
        userId: string;
        name: string;
        avatar?: string;
        role: 'owner' | 'member';
        joinedAt: Timestamp;
    }>;

    // 공유 지출 정보
    sharedExpenses: Array<{
        id: string;
        description: string;
        amount: number;
        paidBy: string;
        participants: string[];
        date: Timestamp;
        category: string;
    }>;
}

// 영수증 타입
export interface Receipt extends FirestoreDocument {
    userId: string;
    tripId: string;

    // 기본 정보
    title: string;
    storeName: string;
    storeNameKr?: string;
    location?: string;
    date: Timestamp;

    // 금액 정보
    amount: number;
    currency: string;
    exchangeRate?: number;
    amountKr?: number;

    // 카테고리 및 태그
    category: string;
    tags: string[];
    notes?: string;

    // 영수증 상세 정보
    receiptDetails?: {
        receiptNo: string;
        cashierNo?: string;
        tel?: string;
        address?: string;
        addressKr?: string;
        time?: string;
        paymentMethod?: string;
        paymentMethodKr?: string;
        change?: number;
        changeKr?: number;
    };

    // 상품 목록
    items?: Array<{
        code?: string;
        name: string;
        nameKr?: string;
        price: number;
        priceKr?: number;
        quantity: number;
        tax?: string;
    }>;

    // 계산 정보
    subtotal?: number;
    subtotalKr?: number;
    tax?: number;
    taxKr?: number;
    total: number;
    totalKr?: number;

    // 이미지 정보
    imageUrl?: string;
    imageThumbnailUrl?: string;

    // OCR 처리 정보
    ocrProcessed?: boolean;
    ocrConfidence?: number;
}

// 사용자 설정 타입
export interface UserSettings extends FirestoreDocument {
    userId: string;
    theme: 'light' | 'dark' | 'auto';
    currency: string;
    language: string;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    privacy: {
        shareData: boolean;
        publicProfile: boolean;
    };
}

// 통계 데이터 타입 (실시간 집계용)
export interface TripStats extends FirestoreDocument {
    tripId: string;
    userId: string;

    // 일별 통계
    dailyStats: Array<{
        date: string; // YYYY-MM-DD 형식
        amount: number;
        receiptCount: number;
        categories: Array<{
            name: string;
            amount: number;
        }>;
    }>;

    // 카테고리별 통계
    categoryStats: Array<{
        name: string;
        totalAmount: number;
        receiptCount: number;
        percentage: number;
        color: string;
    }>;

    // 멤버별 통계
    memberStats: Array<{
        userId: string;
        name: string;
        totalSpent: number;
        receiptCount: number;
        paidAmount: number;
        balance: number;
    }>;

    // 전체 통계
    totalStats: {
        totalAmount: number;
        totalReceipts: number;
        averagePerDay: number;
        averagePerReceipt: number;
        startDate: Timestamp;
        endDate: Timestamp;
        daysCount: number;
    };
}

// 알림 타입
export interface Notification extends FirestoreDocument {
    userId: string;
    type: 'budget_alert' | 'receipt_added' | 'member_joined' | 'expense_shared';
    title: string;
    message: string;
    data?: any;
    read: boolean;
    actionUrl?: string;
}

// 랭킹 데이터 타입
export interface Ranking extends FirestoreDocument {
    type: 'store' | 'category' | 'location';
    period: 'daily' | 'weekly' | 'monthly' | 'all_time';
    date: string; // YYYY-MM-DD 형식

    items: Array<{
        name: string;
        count: number;
        totalAmount: number;
        averageAmount: number;
        rank: number;
    }>;
}

// API 응답 타입들
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// 쿼리 조건 타입
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
    offset?: number;
}
