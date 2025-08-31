# Firebase 설정 완료 가이드

## 🔧 **1단계: Firebase 프로젝트 설정**

### 1.1 Firebase 콘솔에서 서비스 계정 키 다운로드

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. **TravelReceipt** 프로젝트 선택
3. 왼쪽 메뉴에서 **프로젝트 설정** (⚙️) 클릭
4. **서비스 계정** 탭 클릭
5. **새 비공개 키 생성** 버튼 클릭
6. JSON 파일 다운로드

### 1.2 환경 변수 설정

#### 백엔드 환경 변수 설정

`travel_receipt/backend/.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database (Legacy MongoDB - will be replaced with Firebase)
MONGODB_URI=mongodb://localhost:27017/travelreceipt

# Firebase Configuration
FIREBASE_PROJECT_ID=travelreceipt-b4cb5
FIREBASE_STORAGE_BUCKET=travelreceipt-b4cb5.appspot.com
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"travelreceipt-b4cb5","private_key_id":"YOUR_PRIVATE_KEY_ID","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@travelreceipt-b4cb5.iam.gserviceaccount.com","client_id":"YOUR_CLIENT_ID","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40travelreceipt-b4cb5.iam.gserviceaccount.com"}

# JWT (Legacy - will be replaced with Firebase Auth)
JWT_SECRET=your-super-secret-jwt-key-here

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

**중요**: `FIREBASE_SERVICE_ACCOUNT_KEY`에는 다운로드한 JSON 파일의 전체 내용을 한 줄로 입력하세요.

#### 프론트엔드 환경 변수 설정

`travel_receipt/frontend/.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDtz4Iii1nRTk4dfMfYremukuCZrOVMupI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=travelreceipt-b4cb5.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=travelreceipt-b4cb5
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=travelreceipt-b4cb5.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=92578386731
NEXT_PUBLIC_FIREBASE_APP_ID=1:92578386731:web:150c3433df34729d586b6e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-VNYTS73L7G

# API URL
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## 🔒 **2단계: Firestore 보안 규칙 배포** ✅ 완료

### 2.1 Firebase CLI 설치 (아직 설치하지 않은 경우) ✅ 완료

```bash
npm install -g firebase-tools
```

### 2.2 Firebase 프로젝트에 로그인 ✅ 완료

```bash
firebase login
```

### 2.3 Firestore 보안 규칙 배포 ✅ 완료

```bash
# 프로젝트 루트 디렉토리에서
firebase deploy --only firestore:rules
```

### 2.4 Firestore 인덱스 배포 ✅ 완료

```bash
firebase deploy --only firestore:indexes
```

## 🧪 **3단계: API 테스트**

### 3.1 Firebase ID 토큰 생성

프론트엔드에서 Firebase Auth를 사용하여 ID 토큰을 생성하거나, Firebase Console에서 테스트 토큰을 생성할 수 있습니다.

### 3.2 API 테스트

```bash
# Health Check
curl http://localhost:5001/health

# Firestore API 테스트 (토큰 필요)
curl -X POST http://localhost:5001/api/firestore/trips \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "테스트 여행",
    "description": "Firestore API 테스트",
    "startDate": "2024-01-15",
    "endDate": "2024-01-20",
    "location": "서울",
    "budget": {
      "total": 1000000,
      "currency": "KRW"
    }
  }'
```

## 🔍 **4단계: 문제 해결**

### 4.1 일반적인 문제들

1. **서비스 계정 키 오류**
   - JSON 파일의 내용이 정확히 복사되었는지 확인
   - 줄바꿈 문자(`\n`)가 포함되어 있는지 확인

2. **Firestore 권한 오류**
   - 보안 규칙이 올바르게 배포되었는지 확인
   - 테스트 모드가 활성화되어 있는지 확인

3. **CORS 오류**
   - 프론트엔드와 백엔드 포트가 올바른지 확인

### 4.2 로그 확인

```bash
# 백엔드 로그 확인
tail -f logs/server.log

# Firebase 로그 확인
firebase functions:log
```

## ✅ **완료 확인**

모든 설정이 완료되면 다음을 확인할 수 있습니다:

1. ✅ 백엔드 서버가 Firebase Admin SDK와 연결됨
2. ✅ Firestore 보안 규칙이 배포됨
3. ✅ API 엔드포인트가 정상 작동함
4. ✅ 프론트엔드에서 Firebase Auth 사용 가능

## 🚀 **다음 단계**

설정이 완료되면 다음 중 하나를 선택할 수 있습니다:

1. **프론트엔드 Firebase 직접 연결** - 백엔드 API 없이 프론트엔드에서 직접 Firestore 사용
2. **기존 MongoDB 데이터 마이그레이션** - 기존 데이터를 Firestore로 이전
3. **실제 API 테스트** - 유효한 토큰으로 전체 API 테스트
