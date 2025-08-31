// 실제 Firebase ID 토큰으로 API 테스트
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5001/api/firestore';

// 실제 Firebase ID 토큰 (Firebase Console에서 생성하거나 프론트엔드에서 가져온 토큰)
const FIREBASE_ID_TOKEN = process.env.FIREBASE_ID_TOKEN || 'your-firebase-id-token-here';

async function testWithRealToken() {
    console.log('🚀 실제 Firebase ID 토큰으로 API 테스트 시작...\n');

    if (FIREBASE_ID_TOKEN === 'your-firebase-id-token-here') {
        console.log('❌ FIREBASE_ID_TOKEN 환경 변수가 설정되지 않았습니다.');
        console.log('📝 다음 중 하나의 방법으로 토큰을 설정해주세요:');
        console.log('1. 환경 변수 설정: export FIREBASE_ID_TOKEN="your-token"');
        console.log('2. Firebase Console에서 테스트 사용자 생성 후 토큰 가져오기');
        console.log('3. 프론트엔드에서 Firebase Auth로 로그인 후 토큰 가져오기');
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIREBASE_ID_TOKEN}`
    };

    // 1. 사용자 프로필 조회
    try {
        console.log('1️⃣ 사용자 프로필 조회 테스트...');
        const response = await fetch(`${BASE_URL}/users/profile`, {
            method: 'GET',
            headers
        });

        const data = await response.json();
        console.log('✅ 사용자 프로필:', data);
    } catch (error) {
        console.error('❌ 사용자 프로필 조회 실패:', error.message);
    }

    // 2. 여행 목록 조회
    try {
        console.log('\n2️⃣ 여행 목록 조회 테스트...');
        const response = await fetch(`${BASE_URL}/trips`, {
            method: 'GET',
            headers
        });

        const data = await response.json();
        console.log('✅ 여행 목록:', data);
    } catch (error) {
        console.error('❌ 여행 목록 조회 실패:', error.message);
    }

    // 3. 새 여행 생성
    try {
        console.log('\n3️⃣ 새 여행 생성 테스트...');
        const newTrip = {
            title: '테스트 여행',
            description: 'Firebase API 테스트용 여행',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            destination: '서울',
            budget: 500000
        };

        const response = await fetch(`${BASE_URL}/trips`, {
            method: 'POST',
            headers,
            body: JSON.stringify(newTrip)
        });

        const data = await response.json();
        console.log('✅ 새 여행 생성:', data);
    } catch (error) {
        console.error('❌ 새 여행 생성 실패:', error.message);
    }

    // 4. 영수증 목록 조회
    try {
        console.log('\n4️⃣ 영수증 목록 조회 테스트...');
        const response = await fetch(`${BASE_URL}/receipts`, {
            method: 'GET',
            headers
        });

        const data = await response.json();
        console.log('✅ 영수증 목록:', data);
    } catch (error) {
        console.error('❌ 영수증 목록 조회 실패:', error.message);
    }

    console.log('\n🏁 API 테스트 완료!');
}

// 스크립트 실행
if (require.main === module) {
    testWithRealToken().catch(console.error);
}

module.exports = { testWithRealToken };
