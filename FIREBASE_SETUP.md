# Firebase 설정 가이드

이 문서는 TravelReceipt 프로젝트에서 Firebase Firestore를 설정하는 방법을 설명합니다.

## 🔥 Firebase 프로젝트 생성

### 1. Firebase 콘솔 접속
- [Firebase Console](https://console.firebase.google.com/)에 접속
- Google 계정으로 로그인

### 2. 새 프로젝트 생성
1. "프로젝트 추가" 클릭
2. 프로젝트 이름: `travelreceipt` (또는 원하는 이름)
3. Google Analytics 활성화 (선택사항)
4. "프로젝트 만들기" 클릭

### 3. Firestore 데이터베이스 설정
1. 왼쪽 메뉴에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. 보안 규칙 선택:
   - **테스트 모드**: 개발 중에는 "테스트 모드에서 시작" 선택
   - **프로덕션**: 나중에 보안 규칙 설정 필요
4. 위치 선택: `asia-northeast3 (서울)` 또는 가까운 리전

## 🔑 Firebase 설정 정보 가져오기

### 1. 웹 앱 설정
1. 프로젝트 개요 페이지에서 "웹" 아이콘 클릭
2. 앱 닉네임: `travelreceipt-web`
3. "앱 등록" 클릭
4. 설정 정보 복사 (firebaseConfig 객체)

### 2. 서비스 계정 키 생성 (백엔드용)
1. 프로젝트 설정 → 서비스 계정 탭
2. "새 비공개 키 생성" 클릭
3. JSON 파일 다운로드

## 📝 환경 변수 설정

### Frontend (.env.local)
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Backend (.env)
```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}

# 기존 설정들...
```

## 🔒 Firestore 보안 규칙 설정

### 개발용 규칙 (테스트 모드)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 프로덕션용 규칙 (권장)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 인증 확인
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // 사용자 본인 확인
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // 사용자 컬렉션
    match /users/{userId} {
      allow read, write: if isAuthenticated() && isOwner(userId);
    }
    
    // 여행 컬렉션
    match /trips/{tripId} {
      allow read, write: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
    }
    
    // 영수증 컬렉션
    match /receipts/{receiptId} {
      allow read, write: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## 📊 Firestore 컬렉션 구조

### Users 컬렉션
```javascript
{
  id: "user_id",
  email: "user@example.com",
  name: "사용자명",
  avatar: "image_url",
  preferences: {
    currency: "KRW",
    language: "ko",
    notifications: true
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Trips 컬렉션
```javascript
{
  id: "trip_id",
  userId: "user_id",
  title: "여행 제목",
  description: "여행 설명",
  startDate: timestamp,
  endDate: timestamp,
  location: "여행지",
  status: "active", // active, completed, cancelled
  
  budget: {
    total: 1000000,
    currency: "KRW",
    spent: 500000,
    remaining: 500000
  },
  
  stats: {
    totalAmount: 500000,
    receiptCount: 10,
    days: 5,
    dailyAverage: 100000
  },
  
  categories: [
    {
      name: "food",
      amount: 200000,
      percentage: 40,
      color: "#FF6B6B"
    }
  ],
  
  members: [
    {
      userId: "user_id1",
      name: "멤버1",
      avatar: "image_url",
      role: "owner",
      joinedAt: timestamp
    }
  ],
  
  sharedExpenses: [
    {
      id: "expense_id",
      description: "공유 지출",
      amount: 50000,
      paidBy: "user_id1",
      participants: ["user_id1", "user_id2"],
      date: timestamp,
      category: "food"
    }
  ],
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Receipts 컬렉션
```javascript
{
  id: "receipt_id",
  userId: "user_id",
  tripId: "trip_id",
  
  title: "영수증 제목",
  storeName: "매장명",
  storeNameKr: "매장명(한글)",
  location: "위치",
  date: timestamp,
  
  amount: 50000,
  currency: "KRW",
  exchangeRate: 1.0,
  amountKr: 50000,
  
  category: "food",
  tags: ["태그1", "태그2"],
  notes: "메모",
  
  receiptDetails: {
    receiptNo: "12345",
    cashierNo: "001",
    tel: "02-1234-5678",
    address: "서울시 강남구",
    addressKr: "서울시 강남구",
    time: "14:30",
    paymentMethod: "카드",
    paymentMethodKr: "카드",
    change: 0,
    changeKr: 0
  },
  
  items: [
    {
      code: "ITEM001",
      name: "상품명",
      nameKr: "상품명(한글)",
      price: 25000,
      priceKr: 25000,
      quantity: 1,
      tax: "10%"
    }
  ],
  
  subtotal: 45000,
  subtotalKr: 45000,
  tax: 5000,
  taxKr: 5000,
  total: 50000,
  totalKr: 50000,
  
  imageUrl: "image_url",
  imageThumbnailUrl: "thumbnail_url",
  
  ocrProcessed: true,
  ocrConfidence: 0.95,
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### UserSettings 컬렉션
```javascript
{
  id: "user_id",
  userId: "user_id",
  theme: "light", // light, dark, auto
  currency: "KRW",
  language: "ko",
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  privacy: {
    shareData: false,
    publicProfile: false
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### TripStats 컬렉션 (실시간 집계용)
```javascript
{
  id: "trip_id",
  tripId: "trip_id",
  userId: "user_id",
  
  dailyStats: [
    {
      date: "2024-01-15",
      amount: 100000,
      receiptCount: 3,
      categories: [
        { name: "food", amount: 60000 },
        { name: "transport", amount: 40000 }
      ]
    }
  ],
  
  categoryStats: [
    {
      name: "food",
      totalAmount: 200000,
      receiptCount: 6,
      percentage: 40,
      color: "#FF6B6B"
    }
  ],
  
  memberStats: [
    {
      userId: "user_id1",
      name: "멤버1",
      totalSpent: 150000,
      receiptCount: 4,
      paidAmount: 200000,
      balance: 50000
    }
  ],
  
  totalStats: {
    totalAmount: 500000,
    totalReceipts: 15,
    averagePerDay: 100000,
    averagePerReceipt: 33333,
    startDate: timestamp,
    endDate: timestamp,
    daysCount: 5
  },
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🚀 다음 단계

1. **Firebase 프로젝트 생성 완료**
2. **환경 변수 설정 완료**
3. **기존 MongoDB 모델을 Firestore 구조로 변환** (2단계)
4. **백엔드 API를 Firestore 사용하도록 수정** (3단계)
5. **프론트엔드에서 Firebase 직접 연결** (4단계)

## 🔧 문제 해결

### 일반적인 문제들
1. **CORS 오류**: Firebase 콘솔에서 인증된 도메인 추가
2. **권한 오류**: Firestore 보안 규칙 확인
3. **연결 오류**: 환경 변수 설정 확인

### 디버깅
- Firebase 콘솔의 로그 확인
- 브라우저 개발자 도구의 네트워크 탭 확인
- 백엔드 로그 확인
