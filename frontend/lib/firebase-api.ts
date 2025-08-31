// Firebase API 서비스
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/firestore';

// API 요청 헬퍼 함수
async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const token = await getAuthToken();

    // 디버깅: 요청 정보 출력
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('=== API 요청 디버깅 ===');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('endpoint:', endpoint);
    console.log('fullUrl:', fullUrl);
    console.log('method:', options.method || 'GET');
    console.log('토큰 존재:', !!token);
    console.log('========================');

    const response = await fetch(fullUrl, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API 응답 에러:', response.status, response.statusText, errorText);
        try {
            const error = JSON.parse(errorText);
            throw new Error(error.message || 'API 요청 실패');
        } catch (parseError) {
            throw new Error(`API 요청 실패: ${response.status} ${response.statusText} - ${errorText}`);
        }
    }

    const responseText = await response.text();
    try {
        return JSON.parse(responseText);
    } catch (parseError) {
        console.error('JSON 파싱 실패:', responseText);
        throw new Error('서버 응답을 파싱할 수 없습니다');
    }
}

// Firebase Auth 토큰 가져오기
async function getAuthToken(): Promise<string> {
    // Firebase Auth에서 현재 사용자의 ID 토큰 가져오기
    const { auth } = await import('./firebase');
    const user = auth.currentUser;

    if (!user) {
        throw new Error('사용자가 로그인되지 않았습니다');
    }

    return await user.getIdToken();
}

// Trip 관련 API
export const tripAPI = {
    // 여행 목록 조회
    async getTrips() {
        return apiRequest('/trips');
    },

    // 여행 상세 조회
    async getTrip(tripId: string) {
        return apiRequest(`/trips/${tripId}`);
    },

    // 새 여행 생성
    async createTrip(tripData: any) {
        return apiRequest('/trips', {
            method: 'POST',
            body: JSON.stringify(tripData),
        });
    },

    // 여행 수정
    async updateTrip(tripId: string, tripData: any) {
        return apiRequest(`/trips/${tripId}`, {
            method: 'PUT',
            body: JSON.stringify(tripData),
        });
    },

    // 여행 삭제
    async deleteTrip(tripId: string) {
        return apiRequest(`/trips/${tripId}`, {
            method: 'DELETE',
        });
    },

    // 여행 통계 조회
    async getTripStats(tripId: string) {
        return apiRequest(`/trips/${tripId}/stats`);
    },

    // 여행 멤버 추가
    async addTripMember(tripId: string, memberData: any) {
        return apiRequest(`/trips/${tripId}/members`, {
            method: 'POST',
            body: JSON.stringify(memberData),
        });
    },

    // 여행 멤버 제거
    async removeTripMember(tripId: string, memberId: string) {
        return apiRequest(`/trips/${tripId}/members/${memberId}`, {
            method: 'DELETE',
        });
    },
};

// Receipt 관련 API
export const receiptAPI = {
    // 영수증 목록 조회
    async getReceipts(tripId?: string) {
        const endpoint = tripId ? `/receipts?tripId=${tripId}` : '/receipts';
        return apiRequest(endpoint);
    },

    // 영수증 상세 조회
    async getReceipt(receiptId: string) {
        return apiRequest(`/receipts/${receiptId}`);
    },

    // 새 영수증 생성
    async createReceipt(receiptData: any) {
        return apiRequest('/receipts', {
            method: 'POST',
            body: JSON.stringify(receiptData),
        });
    },

    // 영수증 수정
    async updateReceipt(receiptId: string, receiptData: any) {
        return apiRequest(`/receipts/${receiptId}`, {
            method: 'PUT',
            body: JSON.stringify(receiptData),
        });
    },

    // 영수증 삭제
    async deleteReceipt(receiptId: string) {
        return apiRequest(`/receipts/${receiptId}`, {
            method: 'DELETE',
        });
    },

    // 카테고리별 영수증 조회
    async getReceiptsByCategory(category: string) {
        return apiRequest(`/receipts/category/${category}`);
    },

    // 날짜 범위별 영수증 조회
    async getReceiptsByDateRange(startDate: string, endDate: string) {
        return apiRequest(`/receipts/date-range?start=${startDate}&end=${endDate}`);
    },
};

// User 관련 API
export const userAPI = {
    // 사용자 프로필 조회
    async getUserProfile() {
        return apiRequest('/users/profile');
    },

    // 사용자 프로필 수정
    async updateUserProfile(profileData: any) {
        return apiRequest('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    },

    // 사용자 설정 조회
    async getUserSettings() {
        return apiRequest('/users/settings');
    },

    // 사용자 설정 수정
    async updateUserSettings(settingsData: any) {
        return apiRequest('/users/settings', {
            method: 'PUT',
            body: JSON.stringify(settingsData),
        });
    },

    // 사용자 통계 조회
    async getUserStats() {
        return apiRequest('/users/stats');
    },
};

// 타입 정의
export interface Trip {
    id: string;
    userId: string;
    title: string;
    description: string;
    startDate: any;
    endDate: any;
    location: string;
    status: string;
    budget: {
        total: number;
        currency: string;
        spent: number;
        remaining: number;
    };
    stats: {
        totalAmount: number;
        receiptCount: number;
        days: number;
        dailyAverage: number;
    };
    categories: string[];
    members: any[];
    sharedExpenses: any[];
    createdAt: any;
    updatedAt: any;
}

export interface Receipt {
    id: string;
    userId: string;
    tripId: string;
    store: string;
    date: string;
    time: string;
    amount: number;
    category: string;
    items: any[];
    imageUrl?: string;
    createdAt: any;
    updatedAt: any;
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    settings: any;
    createdAt: any;
    updatedAt: any;
}
