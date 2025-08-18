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

// Reviews
export interface Review {
  id: string;
  userId: string;
  authorRole: 'creator' | 'companion';
  productKey: string; // item code 우선, 없으면 정규화된 이름
  productName: string;
  productCode?: string;
  rating: number; // 0.5 ~ 5.0
  text: string; // 0~100 chars
  receiptId?: string;
  tripId?: string;
  createdAt: string;
  updatedAt: string;
  editCount: number; // 수정된 횟수 (최대 2회)
}

// Mock data (base)
const mockReceiptsBase: Receipt[] = [
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

// Additional mock receipts to ensure we have more than 7 for UI testing
const mockReceiptsExtra: Receipt[] = [
  {
    _id: '3',
    userId: 'user1',
    tripId: 'trip1',
    store: "JR大阪駅 キオスク",
    storeKr: "JR오사카역 키오스크",
    tel: "06-0000-0000",
    address: "大阪府大阪市北区梅田3-1-1",
    addressKr: "오사카부 오사카시 키타구 우메다 3-1-1",
    date: "2024-11-16",
    time: "18:45:10",
    receiptNo: "0010",
    cashierNo: "002-002",
    items: [
      { code: "4900000000001", name: "ペットボトル水", nameKr: "생수", price: 110, priceKr: 973, quantity: 1, tax: "内税" },
    ],
    subtotal: 110,
    subtotalKr: 973,
    tax: 0,
    taxKr: 0,
    total: 110,
    totalKr: 973,
    totalAmount: 973,
    exchangeRate: 8.85,
    paymentMethod: "現金",
    paymentMethodKr: "현금",
    change: 0,
    changeKr: 0,
    category: "음식",
    storeType: "편의점/잡화점",
    productTypes: ["음료"],
    createdAt: "2024-11-16T18:45:10.000Z",
    updatedAt: "2024-11-16T18:45:10.000Z"
  },
  {
    _id: '4',
    userId: 'user1',
    tripId: 'trip1',
    store: "マツモトキヨシ なんば店",
    storeKr: "마츠모토키요시 난바점",
    tel: "06-1234-5678",
    address: "大阪府大阪市中央区難波3-7-1",
    addressKr: "오사카부 오사카시 주오구 난바 3-7-1",
    date: "2024-11-16",
    time: "20:12:00",
    receiptNo: "0042",
    cashierNo: "010-003",
    items: [
      { code: "4902400000001", name: "日焼け止め", nameKr: "선크림", price: 798, priceKr: 7055, quantity: 1, tax: "外税" }
    ],
    subtotal: 798,
    subtotalKr: 7055,
    tax: 80,
    taxKr: 707,
    total: 878,
    totalKr: 7762,
    totalAmount: 7762,
    exchangeRate: 8.84,
    paymentMethod: "カード",
    paymentMethodKr: "카드",
    change: 0,
    changeKr: 0,
    category: "쇼핑",
    storeType: "드럭스토어",
    productTypes: ["화장품"],
    createdAt: "2024-11-16T20:12:00.000Z",
    updatedAt: "2024-11-16T20:12:00.000Z"
  },
  {
    _id: '5',
    userId: 'user1',
    tripId: 'trip1',
    store: "すき家 心斎橋店",
    storeKr: "스키야 신사이바시점",
    tel: "06-1111-2222",
    address: "大阪府大阪市中央区心斎橋1-1-1",
    addressKr: "오사카부 오사카시 주오구 신사이바시 1-1-1",
    date: "2024-11-15",
    time: "12:20:00",
    receiptNo: "0301",
    cashierNo: "001-001",
    items: [
      { code: "4903300000001", name: "牛丼 並", nameKr: "규동 보통", price: 400, priceKr: 3536, quantity: 1, tax: "内税" }
    ],
    subtotal: 400,
    subtotalKr: 3536,
    tax: 0,
    taxKr: 0,
    total: 400,
    totalKr: 3536,
    totalAmount: 3536,
    exchangeRate: 8.84,
    paymentMethod: "現金",
    paymentMethodKr: "현금",
    change: 0,
    changeKr: 0,
    category: "음식",
    storeType: "식당",
    productTypes: ["식사"],
    createdAt: "2024-11-15T12:20:00.000Z",
    updatedAt: "2024-11-15T12:20:00.000Z"
  },
  {
    _id: '6',
    userId: 'user1',
    tripId: 'trip1',
    store: "ローソン なんば駅前",
    storeKr: "로손 난바역 앞",
    tel: "06-3333-4444",
    address: "大阪府大阪市中央区難波4-1-1",
    addressKr: "오사카부 오사카시 주오구 난바 4-1-1",
    date: "2024-11-15",
    time: "08:05:00",
    receiptNo: "0210",
    cashierNo: "005-002",
    items: [
      { code: "4904400000001", name: "おにぎり 梅", nameKr: "주먹밥 매실", price: 130, priceKr: 1150, quantity: 1, tax: "内税" }
    ],
    subtotal: 130,
    subtotalKr: 1150,
    tax: 0,
    taxKr: 0,
    total: 130,
    totalKr: 1150,
    totalAmount: 1150,
    exchangeRate: 8.85,
    paymentMethod: "現金",
    paymentMethodKr: "현금",
    change: 0,
    changeKr: 0,
    category: "음식",
    storeType: "편의점/잡화점",
    productTypes: ["음식"],
    createdAt: "2024-11-15T08:05:00.000Z",
    updatedAt: "2024-11-15T08:05:00.000Z"
  },
  {
    _id: '7',
    userId: 'user1',
    tripId: 'trip1',
    store: "ビックカメラ なんば店",
    storeKr: "빅카메라 난바점",
    tel: "06-5555-6666",
    address: "大阪府大阪市中央区難波5-1-5",
    addressKr: "오사카부 오사카시 주오구 난바 5-1-5",
    date: "2024-11-14",
    time: "16:10:00",
    receiptNo: "1202",
    cashierNo: "020-010",
    items: [
      { code: "4905500000001", name: "イヤホン", nameKr: "이어폰", price: 1980, priceKr: 17503, quantity: 1, tax: "外税" }
    ],
    subtotal: 1980,
    subtotalKr: 17503,
    tax: 198,
    taxKr: 1753,
    total: 2178,
    totalKr: 19256,
    totalAmount: 19256,
    exchangeRate: 8.84,
    paymentMethod: "カード",
    paymentMethodKr: "카드",
    change: 0,
    changeKr: 0,
    category: "쇼핑",
    storeType: "전자제품",
    productTypes: ["전자"],
    createdAt: "2024-11-14T16:10:00.000Z",
    updatedAt: "2024-11-14T16:10:00.000Z"
  },
  {
    _id: '8',
    userId: 'user1',
    tripId: 'trip1',
    store: "タリーズコーヒー なんば",
    storeKr: "털리스 커피 난바",
    tel: "06-7777-8888",
    address: "大阪府大阪市中央区難波2-2-2",
    addressKr: "오사카부 오사카시 주오구 난바 2-2-2",
    date: "2024-11-14",
    time: "10:05:00",
    receiptNo: "0145",
    cashierNo: "003-004",
    items: [
      { code: "4906600000001", name: "カフェラテ", nameKr: "카페라떼", price: 380, priceKr: 3360, quantity: 1, tax: "内税" }
    ],
    subtotal: 380,
    subtotalKr: 3360,
    tax: 0,
    taxKr: 0,
    total: 380,
    totalKr: 3360,
    totalAmount: 3360,
    exchangeRate: 8.84,
    paymentMethod: "現金",
    paymentMethodKr: "현금",
    change: 0,
    changeKr: 0,
    category: "음식",
    storeType: "카페",
    productTypes: ["음료"],
    createdAt: "2024-11-14T10:05:00.000Z",
    updatedAt: "2024-11-14T10:05:00.000Z"
  }
];

const mockReceipts: Receipt[] = [...mockReceiptsBase, ...mockReceiptsExtra];

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
const REVIEWS_KEY = 'travel_reviews';
const CURRENT_USER_ID_KEY = 'current_user_id';

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

    if (!localStorage.getItem(REVIEWS_KEY)) {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify([] as Review[]));
    }
    // Ensure at least 8 receipts for demo purposes
    try {
      const raw = localStorage.getItem(RECEIPTS_KEY);
      if (raw) {
        const existing: Receipt[] = JSON.parse(raw);
        if (Array.isArray(existing) && existing.length < 8) {
          // Append extras that are not already present by id
          const existingIds = new Set(existing.map(r => r._id));
          const toAppend = mockReceiptsExtra.filter(r => !existingIds.has(r._id)).slice(0, 8 - existing.length);
          if (toAppend.length > 0) {
            localStorage.setItem(RECEIPTS_KEY, JSON.stringify([...existing, ...toAppend]));
          }
        }
      }
    } catch {}
    if (!localStorage.getItem(CURRENT_USER_ID_KEY)) {
      // 데모 용 기본 사용자
      localStorage.setItem(CURRENT_USER_ID_KEY, 'user1');
    }
  } catch (error) {
    console.error('localStorage access error:', error);
  }
};

// Session-like helper
export const session = {
  getCurrentUserId: (): string => {
    if (typeof window === 'undefined') return 'user1';
    initializeStorage();
    try {
      return localStorage.getItem(CURRENT_USER_ID_KEY) || 'user1';
    } catch {
      return 'user1';
    }
  },
  setCurrentUserId: (userId: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CURRENT_USER_ID_KEY, userId);
    } catch {}
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

// Utilities
const normalizeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\./g, '')
    .replace(/-/g, '')
    .replace(/_/g, '');

const getProductKey = (productCode?: string, productName?: string) => {
  if (productCode && productCode.trim().length > 0) return productCode;
  if (productName && productName.trim().length > 0) return `name:${normalizeName(productName)}`;
  return `name:${Date.now()}`;
};

// Review operations
export const reviewStorage = {
  getAll: (): Review[] => {
    if (typeof window === 'undefined') return [];
    initializeStorage();
    try {
      const reviews = localStorage.getItem(REVIEWS_KEY);
      return reviews ? JSON.parse(reviews) : [];
    } catch (error) {
      console.error('localStorage access error:', error);
      return [];
    }
  },

  getByProduct: (productCode?: string, productName?: string): Review[] => {
    const key = getProductKey(productCode, productName);
    return reviewStorage.getAll().filter(r => r.productKey === key);
  },

  create: (params: {
    userId: string;
    productName: string;
    productCode?: string;
    rating: number;
    text: string;
    receiptId?: string;
    tripId?: string;
  }): Review => {
    if (typeof window === 'undefined') throw new Error('Cannot create review on server side');
    const reviews = reviewStorage.getAll();
    // 작성자 역할 계산(생성자/동행자)
    let authorRole: 'creator' | 'companion' = 'companion';
    if (params.tripId) {
      const trip = tripStorage.getById(params.tripId);
      if (trip && trip.creatorId === params.userId) {
        authorRole = 'creator';
      } else {
        authorRole = 'companion';
      }
    }
    const review: Review = {
      id: Date.now().toString(),
      userId: params.userId,
      authorRole,
      productKey: getProductKey(params.productCode, params.productName),
      productName: params.productName,
      productCode: params.productCode,
      rating: Math.min(5, Math.max(0.5, Math.round(params.rating * 2) / 2)),
      text: (params.text || '').slice(0, 100),
      receiptId: params.receiptId,
      tripId: params.tripId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      editCount: 0,
    };
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify([...reviews, review]));
    } catch (error) {
      console.error('localStorage access error:', error);
    }
    return review;
  },

  getByUserAndProduct: (
    userId: string,
    productCode?: string,
    productName?: string,
    tripId?: string
  ): Review | null => {
    const key = getProductKey(productCode, productName);
    const all = reviewStorage.getAll();
    return (
      all.find(
        (r) => r.userId === userId && r.productKey === key && (tripId ? r.tripId === tripId : true)
      ) || null
    );
  },

  update: (userId: string, reviewId: string, data: { rating?: number; text?: string }): Review => {
    if (typeof window === 'undefined') throw new Error('Cannot update review on server side');
    const reviews = reviewStorage.getAll();
    const index = reviews.findIndex(r => r.id === reviewId);
    if (index === -1) throw new Error('Review not found');
    const existing = reviews[index];
    if (existing.userId !== userId) {
      throw new Error('본인 리뷰만 수정할 수 있습니다.');
    }
    const currentEditCount = typeof existing.editCount === 'number' ? existing.editCount : 0;
    if (currentEditCount >= 2) {
      throw new Error('리뷰 수정 가능 횟수를 초과했습니다. (최대 2회)');
    }
    const updated: Review = {
      ...existing,
      rating: data.rating !== undefined ? Math.min(5, Math.max(0.5, Math.round(data.rating * 2) / 2)) : existing.rating,
      text: data.text !== undefined ? (data.text || '').slice(0, 100) : existing.text,
      editCount: currentEditCount + 1,
      updatedAt: new Date().toISOString(),
    };
    const next = [...reviews];
    next[index] = updated;
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('localStorage access error:', error);
    }
    return updated;
  },
};
