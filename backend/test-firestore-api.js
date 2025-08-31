// Firestore API 테스트 스크립트
// 사용법: node test-firestore-api.js

const BASE_URL = 'http://localhost:5001/api/firestore';

// 테스트용 Firebase ID 토큰 (실제 테스트 시에는 유효한 토큰으로 교체)
const TEST_TOKEN = 'your-firebase-id-token-here';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_TOKEN}`
};

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

async function testCreateTrip() {
    try {
        const tripData = {
            title: '테스트 여행',
            description: 'Firestore API 테스트용 여행',
            startDate: '2024-01-15',
            endDate: '2024-01-20',
            location: '서울',
            budget: {
                total: 1000000,
                currency: 'KRW'
            }
        };

        const response = await fetch(`${BASE_URL}/trips`, {
            method: 'POST',
            headers,
            body: JSON.stringify(tripData)
        });

        const data = await response.json();
        console.log('✅ Create Trip:', data);
        return data.id;
    } catch (error) {
        console.error('❌ Create Trip Failed:', error.message);
    }
}

async function testGetTrips() {
    try {
        const response = await fetch(`${BASE_URL}/trips`, {
            method: 'GET',
            headers
        });

        const data = await response.json();
        console.log('✅ Get Trips:', data);
    } catch (error) {
        console.error('❌ Get Trips Failed:', error.message);
    }
}

async function testCreateReceipt(tripId) {
    try {
        const receiptData = {
            tripId,
            title: '테스트 영수증',
            storeName: '테스트 매장',
            date: '2024-01-15T12:00:00Z',
            amount: 50000,
            currency: 'KRW',
            category: 'food',
            total: 50000
        };

        const response = await fetch(`${BASE_URL}/receipts`, {
            method: 'POST',
            headers,
            body: JSON.stringify(receiptData)
        });

        const data = await response.json();
        console.log('✅ Create Receipt:', data);
        return data.id;
    } catch (error) {
        console.error('❌ Create Receipt Failed:', error.message);
    }
}

async function testGetReceipts() {
    try {
        const response = await fetch(`${BASE_URL}/receipts`, {
            method: 'GET',
            headers
        });

        const data = await response.json();
        console.log('✅ Get Receipts:', data);
    } catch (error) {
        console.error('❌ Get Receipts Failed:', error.message);
    }
}

async function testGetUserProfile() {
    try {
        const response = await fetch(`${BASE_URL}/users/profile`, {
            method: 'GET',
            headers
        });

        const data = await response.json();
        console.log('✅ Get User Profile:', data);
    } catch (error) {
        console.error('❌ Get User Profile Failed:', error.message);
    }
}

// 메인 테스트 실행
async function runTests() {
    console.log('🚀 Starting Firestore API Tests...\n');

    // 1. Health Check
    await testHealthCheck();
    console.log('');

    // 2. User Profile
    await testGetUserProfile();
    console.log('');

    // 3. Create Trip
    const tripId = await testCreateTrip();
    console.log('');

    // 4. Get Trips
    await testGetTrips();
    console.log('');

    // 5. Create Receipt
    if (tripId) {
        await testCreateReceipt(tripId);
        console.log('');
    }

    // 6. Get Receipts
    await testGetReceipts();
    console.log('');

    console.log('🏁 Firestore API Tests Completed!');
}

// 스크립트 실행
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = {
    testHealthCheck,
    testCreateTrip,
    testGetTrips,
    testCreateReceipt,
    testGetReceipts,
    testGetUserProfile
};
