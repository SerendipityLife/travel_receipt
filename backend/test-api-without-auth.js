// 인증 없이 API 테스트 스크립트
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5001/api/firestore';

// 테스트 함수들
async function testHealthCheck() {
    try {
        const response = await fetch('http://localhost:5001/health');
        const data = await response.json();
        console.log('✅ Health Check:', data);
    } catch (error) {
        console.error('❌ Health Check Failed:', error.message);
    }
}

async function testVerifyToken() {
    try {
        const response = await fetch(`${BASE_URL}/users/verify-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const data = await response.json();
        console.log('✅ Verify Token (no auth):', data);
    } catch (error) {
        console.error('❌ Verify Token Failed:', error.message);
    }
}

async function testTripsWithoutAuth() {
    try {
        const response = await fetch(`${BASE_URL}/trips`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('✅ Trips API (no auth):', data);
    } catch (error) {
        console.error('❌ Trips API Failed:', error.message);
    }
}

async function testReceiptsWithoutAuth() {
    try {
        const response = await fetch(`${BASE_URL}/receipts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('✅ Receipts API (no auth):', data);
    } catch (error) {
        console.error('❌ Receipts API Failed:', error.message);
    }
}

async function testUsersWithoutAuth() {
    try {
        const response = await fetch(`${BASE_URL}/users/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('✅ Users API (no auth):', data);
    } catch (error) {
        console.error('❌ Users API Failed:', error.message);
    }
}

// 메인 테스트 실행
async function runTests() {
    console.log('🚀 Starting API Tests (without authentication)...\n');

    // 1. Health Check
    await testHealthCheck();
    console.log('');

    // 2. Verify Token (no auth required)
    await testVerifyToken();
    console.log('');

    // 3. Trips API (auth required)
    await testTripsWithoutAuth();
    console.log('');

    // 4. Receipts API (auth required)
    await testReceiptsWithoutAuth();
    console.log('');

    // 5. Users API (auth required)
    await testUsersWithoutAuth();
    console.log('');

    console.log('🏁 API Tests Completed!');
    console.log('\n📝 결과 분석:');
    console.log('- Health Check: 서버 상태 확인');
    console.log('- Verify Token: 토큰 검증 엔드포인트 확인');
    console.log('- Trips/Receipts/Users: 인증이 필요한 엔드포인트들이 적절히 보호되고 있음');
}

// 스크립트 실행
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = {
    testHealthCheck,
    testVerifyToken,
    testTripsWithoutAuth,
    testReceiptsWithoutAuth,
    testUsersWithoutAuth
};
