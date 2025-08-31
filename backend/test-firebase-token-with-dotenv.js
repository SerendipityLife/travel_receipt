// Firebase ID 토큰 생성 테스트 스크립트 (dotenv 사용)
require('dotenv').config();
const admin = require('firebase-admin');

console.log('🔍 환경 변수 확인:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_SERVICE_ACCOUNT_KEY 길이:', process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? process.env.FIREBASE_SERVICE_ACCOUNT_KEY.length : 'undefined');

// Firebase Admin SDK 초기화 (환경 변수에서 설정)
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : null;

if (!serviceAccount) {
    console.error('❌ FIREBASE_SERVICE_ACCOUNT_KEY 환경 변수가 설정되지 않았습니다.');
    console.log('📝 .env 파일에 서비스 계정 키를 설정해주세요.');
    process.exit(1);
}

// Firebase Admin SDK 초기화
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || 'travelreceipt-b4cb5'
});

async function createTestUser() {
    try {
        console.log('🔧 테스트 사용자 생성 중...');

        // 테스트 사용자 생성
        const testUser = await admin.auth().createUser({
            email: 'test@travelreceipt.com',
            password: 'testpassword123',
            displayName: 'Test User'
        });

        console.log('✅ 테스트 사용자 생성 완료:', testUser.uid);

        // 커스텀 토큰 생성
        const customToken = await admin.auth().createCustomToken(testUser.uid, {
            role: 'user'
        });

        console.log('✅ 커스텀 토큰 생성 완료');
        console.log('🔑 커스텀 토큰:', customToken);

        // ID 토큰으로 교환 (실제로는 클라이언트에서 수행)
        console.log('\n📝 다음 단계:');
        console.log('1. 프론트엔드에서 Firebase Auth를 사용하여 커스텀 토큰을 ID 토큰으로 교환');
        console.log('2. 생성된 ID 토큰을 사용하여 API 테스트');

        return { uid: testUser.uid, customToken };

    } catch (error) {
        console.error('❌ 에러:', error.message);

        if (error.code === 'auth/email-already-exists') {
            console.log('ℹ️ 테스트 사용자가 이미 존재합니다. 기존 사용자 정보를 사용합니다.');

            // 기존 사용자 찾기
            const userRecord = await admin.auth().getUserByEmail('test@travelreceipt.com');
            const customToken = await admin.auth().createCustomToken(userRecord.uid, {
                role: 'user'
            });

            console.log('✅ 커스텀 토큰 생성 완료');
            console.log('🔑 커스텀 토큰:', customToken);

            return { uid: userRecord.uid, customToken };
        }

        throw error;
    }
}

// 스크립트 실행
if (require.main === module) {
    createTestUser()
        .then(result => {
            console.log('\n🎉 테스트 준비 완료!');
            console.log('사용자 ID:', result.uid);
            console.log('커스텀 토큰:', result.customToken);
        })
        .catch(error => {
            console.error('❌ 스크립트 실행 실패:', error);
            process.exit(1);
        });
}

module.exports = { createTestUser };
