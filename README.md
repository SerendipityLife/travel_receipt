# TravelReceipt

여행 영수증 관리 시스템 - 여행 중 발생하는 모든 지출을 체계적으로 관리하고 예산을 효율적으로 사용할 수 있도록 도와주는 종합적인 여행 경비 관리 솔루션입니다.

## 🚀 주요 기능

- **여행 관리**: 여행 일정 생성 및 관리
- **영수증 스캔**: 카메라를 통한 영수증 스캔 및 저장
- **예산 관리**: 일일/전체 예산 설정 및 실시간 추적
- **동행자 공유**: 여행 멤버별 지출 관리 및 정산
- **카테고리 분석**: 지출 카테고리별 분석 및 통계
- **랭킹 시스템**: 인기 상품, 매장, 여행지 랭킹

## 🏗️ 프로젝트 구조

```
TravelReceipt/
├── frontend/          # Next.js 프론트엔드
│   ├── app/          # Next.js App Router
│   ├── components/   # 재사용 가능한 컴포넌트
│   └── ...
├── backend/          # Express.js 백엔드
│   ├── src/
│   │   ├── controllers/  # API 컨트롤러
│   │   ├── models/       # MongoDB 모델
│   │   ├── routes/       # API 라우터
│   │   ├── middleware/   # 미들웨어
│   │   └── ...
│   └── ...
└── ...
```

## 🛠️ 기술 스택

### Frontend
- **Next.js 15.3.2** - React 프레임워크
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링
- **Remix Icons** - 아이콘

### Backend
- **Express.js** - Node.js 웹 프레임워크
- **MongoDB** - NoSQL 데이터베이스
- **Mongoose** - MongoDB ODM
- **JWT** - 인증
- **bcryptjs** - 비밀번호 해싱

## 📦 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd TravelReceipt
```

### 2. 의존성 설치
```bash
npm run install:all
```

### 3. 환경 변수 설정
```bash
# Backend 환경 변수 설정
cp backend/env.example backend/.env
# .env 파일을 편집하여 필요한 값들을 설정하세요
```

### 4. 개발 서버 실행
```bash
# Frontend와 Backend 동시 실행
npm run dev

# 또는 개별 실행
npm run dev:frontend  # Frontend만 (포트 3000)
npm run dev:backend   # Backend만 (포트 5000)
```

## 🔧 개발 스크립트

```bash
# 개발 서버 실행 (Frontend + Backend)
npm run dev

# 빌드
npm run build

# 린트 검사
npm run lint

# 의존성 정리
npm run clean
```

## 📱 주요 페이지

- **홈**: 여행 목록 및 대시보드
- **영수증 스캔**: 카메라를 통한 영수증 추가
- **영수증 목록**: 모든 영수증 조회
- **랭킹**: 인기 상품, 매장, 여행지
- **설정**: 앱 설정 및 데이터 관리

## 🔐 API 엔드포인트

### 여행 관리
- `GET /api/trips` - 여행 목록 조회
- `POST /api/trips` - 새 여행 생성
- `PUT /api/trips/:id` - 여행 정보 수정
- `DELETE /api/trips/:id` - 여행 삭제

### 영수증 관리
- `POST /api/trips/:id/receipts` - 영수증 추가

### 예산 관리
- `PUT /api/trips/:id/budget` - 예산 수정

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.
