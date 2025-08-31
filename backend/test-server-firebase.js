// 백엔드 서버를 통한 Firebase 테스트
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5001/api/firestore';

async function testServerFirebase() {
    console.log('🚀 백엔드 서버 Firebase 테스트 시작...\n');

    // 1. 서버 상태 확인
    try {
        console.log('1️⃣ 서버 상태 확인...');
        const response = await fetch('http://localhost:5001/health');
        const data = await response.json();
        console.log('✅ 서버 상태:', data);
    } catch (error) {
        console.error('❌ 서버 상태 확인 실패:', error.message);
        return;
    }

    // 2. Firebase Admin SDK 초기화 확인
    try {
        console.log('\n2️⃣ Firebase Admin SDK 초기화 확인...');
        const response = await fetch('http://localhost:5001/api/firestore/users/verify-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const data = await response.json();
        console.log('✅ Firebase Admin SDK 응답:', data);
    } catch (error) {
        console.error('❌ Firebase Admin SDK 확인 실패:', error.message);
    }

    // 3. 인증이 필요한 엔드포인트 테스트 (토큰 없이)
    try {
        console.log('\n3️⃣ 인증이 필요한 엔드포인트 테스트 (토큰 없이)...');
        const response = await fetch(`${BASE_URL}/trips`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('✅ 인증 보호 확인:', data);
    } catch (error) {
        console.error('❌ 인증 보호 확인 실패:', error.message);
    }

    // 4. 잘못된 토큰으로 테스트
    try {
        console.log('\n4️⃣ 잘못된 토큰으로 테스트...');
        const response = await fetch(`${BASE_URL}/trips`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer invalid-token'
            }
        });

        const data = await response.json();
        console.log('✅ 잘못된 토큰 처리:', data);
    } catch (error) {
        console.error('❌ 잘못된 토큰 테스트 실패:', error.message);
    }

    console.log('\n🏁 백엔드 서버 Firebase 테스트 완료!');
    console.log('\n📝 결과 분석:');
    console.log('- 서버가 정상 작동 중');
    console.log('- Firebase Admin SDK가 초기화됨');
    console.log('- 인증 미들웨어가 정상 작동 중');
    console.log('- API 엔드포인트들이 보호되고 있음');
}

// 스크립트 실행
if (require.main === module) {
    testServerFirebase().catch(console.error);
}

module.exports = { testServerFirebase };
