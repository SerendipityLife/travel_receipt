const fetch = require('node-fetch');

// Firebase Auth API 설정
const FIREBASE_API_KEY = 'AIzaSyAgTIySm-f5vxgfv5nV3RZjWm_Npz53nAY';
const FIREBASE_PROJECT_ID = 'travelreceipt-9d63d';

// 로그인 정보
const email = 'test123@naver.com';
const password = 'test123';

async function autoLogin() {
    console.log('🔐 Firebase Auth API로 자동 로그인 시작...\n');

    try {
        // 1. 먼저 로그인 시도
        console.log('1️⃣ 로그인 시도...');
        const loginResponse = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        const loginData = await loginResponse.json();

        if (loginData.error && loginData.error.message === 'INVALID_LOGIN_CREDENTIALS') {
            console.log('⚠️ 계정이 존재하지 않습니다. 회원가입을 시도합니다...');

            // 2. 회원가입 시도
            console.log('2️⃣ 회원가입 시도...');
            const signupResponse = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        returnSecureToken: true
                    })
                }
            );

            const signupData = await signupResponse.json();

            if (signupData.error) {
                console.error('❌ 회원가입 실패:', signupData.error.message);
                return null;
            }

            console.log('✅ 회원가입 성공!');
            console.log('👤 사용자 ID:', signupData.localId);
            console.log('📧 이메일:', signupData.email);
            console.log('🔑 ID 토큰 길이:', signupData.idToken.length);

            return signupData.idToken;
        } else if (loginData.error) {
            console.error('❌ 로그인 실패:', loginData.error.message);
            return null;
        }

        console.log('✅ 로그인 성공!');
        console.log('👤 사용자 ID:', loginData.localId);
        console.log('📧 이메일:', loginData.email);
        console.log('🔑 ID 토큰 길이:', loginData.idToken.length);

        return loginData.idToken;

    } catch (error) {
        console.error('❌ 로그인 중 오류 발생:', error.message);
        return null;
    }
}

async function testWithToken(token) {
    if (!token) {
        console.log('❌ 토큰이 없어서 테스트를 건너뜁니다.');
        return;
    }

    console.log('\n🚀 생성된 토큰으로 API 테스트 시작...\n');

    const BASE_URL = 'http://localhost:5001/api/firestore';

    try {
        // 1. 사용자 프로필 조회 테스트
        console.log('1️⃣ 사용자 프로필 조회 테스트...');
        const profileResponse = await fetch(`${BASE_URL}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const profileData = await profileResponse.json();
        console.log('✅ 사용자 프로필:', profileData);

        // 2. 여행 목록 조회 테스트
        console.log('\n2️⃣ 여행 목록 조회 테스트...');
        const tripsResponse = await fetch(`${BASE_URL}/trips`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const tripsData = await tripsResponse.json();
        console.log('✅ 여행 목록:', tripsData);

        // 3. 새 여행 생성 테스트
        console.log('\n3️⃣ 새 여행 생성 테스트...');
        const newTrip = {
            title: '자동 생성된 여행',
            description: 'API 테스트용 여행',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            location: '서울, 대한민국',
            budget: 500000,
            categories: ['관광', '음식'],
            members: [
                {
                    userId: 't98IOprfyqaZsYZJvB744NB7Qnn1',
                    email: 'test123@naver.com',
                    name: '테스트 사용자',
                    role: 'owner',
                    avatar: null
                }
            ]
        };

        const createTripResponse = await fetch(`${BASE_URL}/trips`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTrip)
        });
        const createTripData = await createTripResponse.json();
        console.log('✅ 새 여행 생성:', createTripData);

        // 4. 영수증 목록 조회 테스트
        console.log('\n4️⃣ 영수증 목록 조회 테스트...');
        const receiptsResponse = await fetch(`${BASE_URL}/receipts`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const receiptsData = await receiptsResponse.json();
        console.log('✅ 영수증 목록:', receiptsData);

        console.log('\n🏁 API 테스트 완료!');

    } catch (error) {
        console.error('❌ API 테스트 중 오류 발생:', error.message);
    }
}

// 메인 실행
async function main() {
    const token = await autoLogin();
    await testWithToken(token);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { autoLogin, testWithToken };
