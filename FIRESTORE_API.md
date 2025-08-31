# Firestore API 문서

이 문서는 TravelReceipt 프로젝트의 Firestore 기반 API 엔드포인트를 설명합니다.

## 🔐 인증

모든 API 요청에는 Firebase ID 토큰이 필요합니다.

```http
Authorization: Bearer <firebase-id-token>
```

## 📍 기본 URL

```
http://localhost:5001/api/firestore
```

---

## 🧳 여행 관리 API

### 여행 목록 조회
```http
GET /trips
```

**응답:**
```json
[
  {
    "id": "trip_id",
    "userId": "user_id",
    "title": "여행 제목",
    "description": "여행 설명",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-01-20T00:00:00.000Z",
    "location": "서울",
    "status": "active",
    "budget": {
      "total": 1000000,
      "currency": "KRW",
      "spent": 500000,
      "remaining": 500000
    },
    "stats": {
      "totalAmount": 500000,
      "receiptCount": 10,
      "days": 5,
      "dailyAverage": 100000
    },
    "categories": [...],
    "members": [...],
    "sharedExpenses": [...],
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

### 여행 상세 조회
```http
GET /trips/{id}
```

### 여행 생성
```http
POST /trips
```

**요청 본문:**
```json
{
  "title": "여행 제목",
  "description": "여행 설명",
  "startDate": "2024-01-15",
  "endDate": "2024-01-20",
  "location": "서울",
  "budget": {
    "total": 1000000,
    "currency": "KRW"
  }
}
```

### 여행 수정
```http
PUT /trips/{id}
```

### 여행 삭제
```http
DELETE /trips/{id}
```

### 여행 통계 조회
```http
GET /trips/{id}/stats
```

### 멤버 추가
```http
POST /trips/{id}/members
```

**요청 본문:**
```json
{
  "memberId": "user_id",
  "memberName": "멤버명",
  "memberAvatar": "avatar_url"
}
```

### 멤버 제거
```http
DELETE /trips/{id}/members/{memberId}
```

---

## 🧾 영수증 관리 API

### 영수증 목록 조회
```http
GET /receipts
```

### 여행별 영수증 조회
```http
GET /receipts/trip/{tripId}
```

### 카테고리별 영수증 조회
```http
GET /receipts/category/{category}
```

### 날짜 범위별 영수증 조회
```http
GET /receipts/date-range?startDate=2024-01-15&endDate=2024-01-20
```

### 영수증 상세 조회
```http
GET /receipts/{id}
```

### 영수증 생성
```http
POST /receipts
```

**요청 본문:**
```json
{
  "tripId": "trip_id",
  "title": "영수증 제목",
  "storeName": "매장명",
  "storeNameKr": "매장명(한글)",
  "location": "위치",
  "date": "2024-01-15T12:00:00Z",
  "amount": 50000,
  "currency": "KRW",
  "exchangeRate": 1.0,
  "amountKr": 50000,
  "category": "food",
  "tags": ["태그1", "태그2"],
  "notes": "메모",
  "receiptDetails": {
    "receiptNo": "12345",
    "cashierNo": "001",
    "tel": "02-1234-5678",
    "address": "서울시 강남구",
    "addressKr": "서울시 강남구",
    "time": "14:30",
    "paymentMethod": "카드",
    "paymentMethodKr": "카드",
    "change": 0,
    "changeKr": 0
  },
  "items": [
    {
      "code": "ITEM001",
      "name": "상품명",
      "nameKr": "상품명(한글)",
      "price": 25000,
      "priceKr": 25000,
      "quantity": 1,
      "tax": "10%"
    }
  ],
  "subtotal": 45000,
  "subtotalKr": 45000,
  "tax": 5000,
  "taxKr": 5000,
  "total": 50000,
  "totalKr": 50000,
  "imageUrl": "image_url",
  "imageThumbnailUrl": "thumbnail_url",
  "ocrProcessed": true,
  "ocrConfidence": 0.95
}
```

### 영수증 수정
```http
PUT /receipts/{id}
```

### 영수증 삭제
```http
DELETE /receipts/{id}
```

---

## 👤 사용자 관리 API

### 사용자 프로필 조회
```http
GET /users/profile
```

### 사용자 프로필 생성
```http
POST /users/profile
```

**요청 본문:**
```json
{
  "email": "user@example.com",
  "name": "사용자명",
  "avatar": "avatar_url",
  "preferences": {
    "currency": "KRW",
    "language": "ko",
    "notifications": true
  }
}
```

### 사용자 프로필 수정
```http
PUT /users/profile
```

### 사용자 프로필 삭제
```http
DELETE /users/profile
```

### 사용자 설정 조회
```http
GET /users/settings
```

### 사용자 설정 수정
```http
PUT /users/settings
```

**요청 본문:**
```json
{
  "currency": "KRW",
  "language": "ko",
  "notifications": true
}
```

### 사용자 통계 조회
```http
GET /users/stats
```

### 토큰 검증
```http
POST /users/verify-token
```

---

## 🔧 에러 응답

### 401 Unauthorized
```json
{
  "message": "No token provided",
  "error": "Authorization header must start with Bearer"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Trip not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Error details"
}
```

---

## 📝 사용 예시

### cURL 예시

```bash
# 여행 생성
curl -X POST http://localhost:5001/api/firestore/trips \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "서울 여행",
    "description": "서울 3박 4일 여행",
    "startDate": "2024-01-15",
    "endDate": "2024-01-18",
    "location": "서울",
    "budget": {
      "total": 1000000,
      "currency": "KRW"
    }
  }'

# 영수증 생성
curl -X POST http://localhost:5001/api/firestore/receipts \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tripId": "trip_id",
    "title": "점심 식사",
    "storeName": "맛있는 식당",
    "date": "2024-01-15T12:00:00Z",
    "amount": 25000,
    "currency": "KRW",
    "category": "food",
    "total": 25000
  }'
```

### JavaScript 예시

```javascript
const BASE_URL = 'http://localhost:5001/api/firestore';
const token = 'YOUR_FIREBASE_TOKEN';

// 여행 목록 조회
const getTrips = async () => {
  const response = await fetch(`${BASE_URL}/trips`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

// 영수증 생성
const createReceipt = async (receiptData) => {
  const response = await fetch(`${BASE_URL}/receipts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(receiptData)
  });
  return response.json();
};
```

---

## 🚀 테스트

API 테스트를 위해 제공된 스크립트를 사용하세요:

```bash
# 테스트 스크립트 실행
node test-firestore-api.js
```

**주의:** 테스트 전에 유효한 Firebase ID 토큰으로 `TEST_TOKEN` 변수를 업데이트하세요.
