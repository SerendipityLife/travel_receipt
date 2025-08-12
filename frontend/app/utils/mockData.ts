export interface Receipt {
  _id: string;
  userId: string;
  tripId?: string;
  store: string;
  storeKr: string;
  tel: string;
  address: string;
  addressKr: string;
  date: string;
  time: string;
  receiptNo: string;
  cashierNo: string;
  items: Array<{
    code: string;
    name: string;
    nameKr: string;
    price: number;
    priceKr: number;
    quantity: number;
    tax: string;
  }>;
  subtotal: number;
  subtotalKr: number;
  tax: number;
  taxKr: number;
  total: number;
  totalKr: number;
  totalAmount: number;
  exchangeRate: number;
  paymentMethod: string;
  paymentMethodKr: string;
  change: number;
  changeKr: number;
  category: string;
  storeType: string;
  productTypes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TripMember {
  id: string;
  name: string;
  permission: 'editor' | 'viewer';
  joinedAt: string;
  inviteCode: string;
}

export interface TripInviteCode {
  tripId: string;
  code: string;
  createdAt: string;
  isActive: boolean;
}

export interface Trip {
  _id: string;
  userId: string;
  creatorId: string; // 여행 생성자 ID
  title: string;
  startDate: string;
  endDate: string;
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  totalAmount: number;
  receiptCount: number;
  expenses: {
    totalSpent: number;
    receipts: number;
  };
  receipts: string[];
  members?: TripMember[];
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockReceipts: Receipt[] = [
  {
    _id: '1',
    userId: 'user1',
    tripId: 'trip1',
    store: "ドン・キホーテ 渋谷店",
    storeKr: "돈키호테 시부야점",
    tel: "03-5428-4086",
    address: "東京都渋谷区宇田川町28-6",
    addressKr: "도쿄도 시부야구 우다가와초 28-6",
    date: "2024-11-16",
    time: "14:32:18",
    receiptNo: "0005",
    cashierNo: "013-018",
    items: [
      {
        code: "4902102070744",
        name: "キットカット 抹茶",
        nameKr: "킷캣 말차",
        price: 298,
        priceKr: 2634,
        quantity: 2,
        tax: "外税"
      },
      {
        code: "4901330540074",
        name: "ポッキー チョコレート",
        nameKr: "포키 초콜릿",
        price: 158,
        priceKr: 1397,
        quantity: 1,
        tax: "外税"
      }
    ],
    subtotal: 1392,
    subtotalKr: 12307,
    tax: 111,
    taxKr: 981,
    total: 1503,
    totalKr: 13288,
    totalAmount: 13288,
    exchangeRate: 8.84,
    paymentMethod: "現金",
    paymentMethodKr: "현금",
    change: 497,
    changeKr: 4393,
    category: "쇼핑",
    storeType: "편의점/잡화점",
    productTypes: ["과자", "음료", "간식"],
    createdAt: "2024-11-16T14:32:18.000Z",
    updatedAt: "2024-11-16T14:32:18.000Z"
  },
  {
    _id: '2',
    userId: 'user1',
    tripId: 'trip1',
    store: "セブンイレブン 浅草店",
    storeKr: "세븐일레븐 아사쿠사점",
    tel: "03-3844-1234",
    address: "東京都台東区浅草1-1-1",
    addressKr: "도쿄도 다이토구 아사쿠사 1-1-1",
    date: "2024-11-16",
    time: "09:15:30",
    receiptNo: "0003",
    cashierNo: "001-005",
    items: [
      {
        code: "4902102070744",
        name: "おにぎり 鮭",
        nameKr: "주먹밥 연어",
        price: 180,
        priceKr: 1591,
        quantity: 1,
        tax: "内税"
      },
      {
        code: "4902102070745",
        name: "お茶 緑茶",
        nameKr: "차 녹차",
        price: 120,
        priceKr: 1061,
        quantity: 1,
        tax: "内税"
      }
    ],
    subtotal: 300,
    subtotalKr: 2652,
    tax: 0,
    taxKr: 0,
    total: 300,
    totalKr: 2652,
    totalAmount: 2652,
    exchangeRate: 8.84,
    paymentMethod: "現金",
    paymentMethodKr: "현금",
    change: 0,
    changeKr: 0,
    category: "음식",
    storeType: "편의점/잡화점",
    productTypes: ["음식", "음료"],
    createdAt: "2024-11-16T09:15:30.000Z",
    updatedAt: "2024-11-16T09:15:30.000Z"
  }
];

const mockTrips: Trip[] = [
  {
    _id: 'trip1',
    userId: 'user1',
    creatorId: 'user1', // 여행 생성자 ID
    title: '오사카 맛집 투어',
    startDate: '2024-11-15',
    endDate: '2024-11-18',
    budget: {
      total: 120000,
      spent: 89200,
      remaining: 30800
    },
    totalAmount: 89200,
    receiptCount: 2,
    expenses: {
      totalSpent: 89200,
      receipts: 2
    },
    receipts: ['1', '2'],
    members: [
      {
        id: '1',
        name: '김친구',
        permission: 'editor',
        joinedAt: '2024-11-10T10:00:00Z',
        inviteCode: 'TRIP123'
      },
      {
        id: '2',
        name: '이동행',
        permission: 'viewer',
        joinedAt: '2024-11-12T14:30:00Z',
        inviteCode: 'TRIP456'
      }
    ],
    createdAt: '2024-11-15T00:00:00.000Z',
    updatedAt: '2024-11-16T14:32:18.000Z'
  }
];

// Local storage keys
const RECEIPTS_KEY = 'travel_receipts';
const TRIPS_KEY = 'travel_trips';

// Initialize local storage with mock data if empty
const initializeStorage = () => {
  if (typeof window === 'undefined') return;
  
  try {
    if (!localStorage.getItem(RECEIPTS_KEY)) {
      localStorage.setItem(RECEIPTS_KEY, JSON.stringify(mockReceipts));
    }
    
    if (!localStorage.getItem(TRIPS_KEY)) {
      localStorage.setItem(TRIPS_KEY, JSON.stringify(mockTrips));
    }
  } catch (error) {
    console.error('localStorage access error:', error);
  }
};

// Receipt operations
export const receiptStorage = {
  getAll: (): Receipt[] => {
    if (typeof window === 'undefined') return mockReceipts;
    
    initializeStorage();
    try {
      const receipts = localStorage.getItem(RECEIPTS_KEY);
      return receipts ? JSON.parse(receipts) : mockReceipts;
    } catch (error) {
      console.error('localStorage access error:', error);
      return mockReceipts;
    }
  },

  getById: (id: string): Receipt | null => {
    if (typeof window === 'undefined') {
      return mockReceipts.find(receipt => receipt._id === id) || null;
    }
    
    const receipts = receiptStorage.getAll();
    return receipts.find(receipt => receipt._id === id) || null;
  },

  create: (data: Partial<Receipt>): Receipt => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot create receipt on server side');
    }
    
    const receipts = receiptStorage.getAll();
    const newReceipt: Receipt = {
      _id: Date.now().toString(),
      userId: 'user1',
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Receipt;
    
    receipts.push(newReceipt);
    try {
      localStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts));
    } catch (error) {
      console.error('localStorage access error:', error);
    }
    
    // Update trip budget
    if (newReceipt.tripId) {
      tripStorage.updateBudget(newReceipt.tripId, newReceipt.totalAmount);
    }
    
    return newReceipt;
  },

  update: (id: string, data: Partial<Receipt>): Receipt | null => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot update receipt on server side');
    }
    
    const receipts = receiptStorage.getAll();
    const index = receipts.findIndex(receipt => receipt._id === id);
    
    if (index === -1) return null;
    
    const oldReceipt = receipts[index];
    const updatedReceipt = {
      ...receipts[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    receipts[index] = updatedReceipt;
    try {
      localStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts));
    } catch (error) {
      console.error('localStorage access error:', error);
    }
    
    // Update trip budget if amount changed
    if (oldReceipt.tripId && oldReceipt.totalAmount !== updatedReceipt.totalAmount) {
      const amountDiff = updatedReceipt.totalAmount - oldReceipt.totalAmount;
      tripStorage.updateBudget(oldReceipt.tripId, amountDiff);
    }
    
    return updatedReceipt;
  },

  delete: (id: string): boolean => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot delete receipt on server side');
    }
    
    const receipts = receiptStorage.getAll();
    const receipt = receipts.find(r => r._id === id);
    
    if (!receipt) return false;
    
    const filteredReceipts = receipts.filter(r => r._id !== id);
    try {
      localStorage.setItem(RECEIPTS_KEY, JSON.stringify(filteredReceipts));
    } catch (error) {
      console.error('localStorage access error:', error);
    }
    
    // Update trip budget
    if (receipt.tripId) {
      tripStorage.updateBudget(receipt.tripId, -receipt.totalAmount);
    }
    
    return true;
  }
};

// Trip operations
export const tripStorage = {
  getAll: (): Trip[] => {
    if (typeof window === 'undefined') return mockTrips;
    
    initializeStorage();
    try {
      const trips = localStorage.getItem(TRIPS_KEY);
      return trips ? JSON.parse(trips) : mockTrips;
    } catch (error) {
      console.error('localStorage access error:', error);
      return mockTrips;
    }
  },

  getById: (id: string): Trip | null => {
    if (typeof window === 'undefined') {
      return mockTrips.find(trip => trip._id === id) || null;
    }
    
    const trips = tripStorage.getAll();
    return trips.find(trip => trip._id === id) || null;
  },

  updateBudget: (tripId: string, amountChange: number): void => {
    if (typeof window === 'undefined') return;
    
    const trips = tripStorage.getAll();
    const trip = trips.find(t => t._id === tripId);
    
    if (trip) {
      trip.totalAmount += amountChange;
      trip.expenses.totalSpent += amountChange;
      trip.budget.spent = trip.expenses.totalSpent;
      trip.budget.remaining = trip.budget.total - trip.budget.spent;
      trip.updatedAt = new Date().toISOString();
      
      try {
        localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
      } catch (error) {
        console.error('localStorage access error:', error);
      }
    }
  },

  // 초대코드 및 동행자 관리 함수들
  generateInviteCode: (tripId: string): string => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot generate invite code on server side');
    }
    
    // 8자리 랜덤 코드 생성 (숫자 + 대문자)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  },

  joinTripWithCode: (inviteCode: string, name: string, permission: 'editor' | 'viewer'): TripMember => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot join trip on server side');
    }
    
    const trips = tripStorage.getAll();
    const trip = trips.find(t => t._id === inviteCode.substring(0, 4) || t.members?.some(m => m.inviteCode === inviteCode));
    
    if (!trip) {
      throw new Error('Invalid invite code');
    }
    
    // 이미 참여한 멤버인지 확인 (이름으로)
    if (trip.members?.some(member => member.name === name)) {
      throw new Error('Member already joined');
    }
    
    const newMember: TripMember = {
      id: Date.now().toString(),
      name: name,
      permission: permission,
      joinedAt: new Date().toISOString(),
      inviteCode: inviteCode
    };
    
    if (!trip.members) {
      trip.members = [];
    }
    
    trip.members.push(newMember);
    trip.updatedAt = new Date().toISOString();
    
    try {
      localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
    } catch (error) {
      console.error('localStorage access error:', error);
    }
    
    return newMember;
  },

  removeMember: (tripId: string, memberId: string): boolean => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot remove member on server side');
    }
    
    const trips = tripStorage.getAll();
    const trip = trips.find(t => t._id === tripId);
    
    if (!trip || !trip.members) {
      return false;
    }
    
    const initialLength = trip.members.length;
    trip.members = trip.members.filter(member => member.id !== memberId);
    
    if (trip.members.length !== initialLength) {
      trip.updatedAt = new Date().toISOString();
      
      try {
        localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
      } catch (error) {
        console.error('localStorage access error:', error);
      }
      
      return true;
    }
    
    return false;
  },

  updateMemberPermission: (tripId: string, memberId: string, permission: 'editor' | 'viewer'): boolean => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot update member permission on server side');
    }
    
    const trips = tripStorage.getAll();
    const trip = trips.find(t => t._id === tripId);
    
    if (!trip || !trip.members) {
      return false;
    }
    
    const member = trip.members.find(m => m.id === memberId);
    if (!member) {
      return false;
    }
    
    member.permission = permission;
    trip.updatedAt = new Date().toISOString();
    
    try {
      localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
    } catch (error) {
      console.error('localStorage access error:', error);
    }
    
    return true;
  },

  updateMemberInfo: (tripId: string, memberId: string, name: string, permission: 'editor' | 'viewer'): boolean => {
    if (typeof window === 'undefined') {
      throw new Error('Cannot update member info on server side');
    }
    
    const trips = tripStorage.getAll();
    const trip = trips.find(t => t._id === tripId);
    
    if (!trip || !trip.members) {
      return false;
    }
    
    const member = trip.members.find(m => m.id === memberId);
    if (!member) {
      return false;
    }
    
    member.name = name;
    member.permission = permission;
    trip.updatedAt = new Date().toISOString();
    
    try {
      localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
    } catch (error) {
      console.error('localStorage access error:', error);
    }
    
    return true;
  }
};
