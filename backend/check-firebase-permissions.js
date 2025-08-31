// Firebase 권한 확인 스크립트
require('dotenv').config();
const admin = require('firebase-admin');

console.log('🔍 Firebase 권한 확인 시작...\n');

// 1. 환경 변수 확인
console.log('1️⃣ 환경 변수 확인:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_SERVICE_ACCOUNT_KEY 길이:', process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? process.env.FIREBASE_SERVICE_ACCOUNT_KEY.length : 'undefined');

// 2. 서비스 계정 정보 추출
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log('\n2️⃣ 서비스 계정 정보:');
    console.log('Client Email:', serviceAccount.client_email);
    console.log('Project ID:', serviceAccount.project_id);
    console.log('Private Key ID:', serviceAccount.private_key_id);
} catch (error) {
    console.error('❌ 서비스 계정 키 파싱 실패:', error.message);
    process.exit(1);
}

// 3. Firebase Admin SDK 초기화 시도
try {
    console.log('\n3️⃣ Firebase Admin SDK 초기화 시도...');
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
    });

    console.log('✅ Firebase Admin SDK 초기화 성공');
} catch (error) {
    console.error('❌ Firebase Admin SDK 초기화 실패:', error.message);
    process.exit(1);
}

// 4. 권한 테스트
async function testPermissions() {
    try {
        console.log('\n4️⃣ 권한 테스트 시작...');

        // Firestore 권한 테스트
        console.log('📝 Firestore 권한 테스트...');
        const db = admin.firestore();
        const testDoc = db.collection('test').doc('permissions');

        try {
            await testDoc.set({
                test: true,
                timestamp: new Date(),
                message: 'Permission test'
            });
            console.log('✅ Firestore 쓰기 권한 확인');

            const doc = await testDoc.get();
            if (doc.exists) {
                console.log('✅ Firestore 읽기 권한 확인');
                console.log('📄 문서 데이터:', doc.data());
            }

            await testDoc.delete();
            console.log('✅ Firestore 삭제 권한 확인');

        } catch (error) {
            console.error('❌ Firestore 권한 테스트 실패:', error.message);
        }

        // Auth 권한 테스트
        console.log('\n🔐 Auth 권한 테스트...');
        try {
            const auth = admin.auth();
            console.log('✅ Auth 서비스 접근 성공');

            // 사용자 목록 조회 시도 (권한 확인)
            try {
                const listUsersResult = await auth.listUsers(1);
                console.log('✅ Auth 사용자 목록 조회 권한 확인');
            } catch (error) {
                console.log('⚠️ Auth 사용자 목록 조회 권한 없음 (정상):', error.message);
            }

        } catch (error) {
            console.error('❌ Auth 권한 테스트 실패:', error.message);
        }

    } catch (error) {
        console.error('❌ 권한 테스트 실패:', error.message);
    }
}

// 5. 권한 문제 해결 방법 제안
function suggestSolutions() {
    console.log('\n5️⃣ 권한 문제 해결 방법:');
    console.log('\n🔧 Google Cloud Console에서 확인할 사항:');
    console.log('1. IAM 및 관리 → 서비스 계정');
    console.log('2. firebase-adminsdk-fbsvc@travelreceipt-9d63d.iam.gserviceaccount.com 찾기');
    console.log('3. 편집 → 역할 추가:');
    console.log('   - Firebase Admin');
    console.log('   - Cloud Datastore User');
    console.log('   - Firestore User');
    console.log('   - Service Account Token Creator');

    console.log('\n🔄 권한 변경 후 대기 시간:');
    console.log('- 권한 변경은 최대 5-10분 정도 소요될 수 있습니다.');
    console.log('- 변경 후 잠시 기다린 후 다시 테스트해보세요.');

    console.log('\n📝 대안 방법:');
    console.log('1. 새로운 서비스 계정 키 생성');
    console.log('2. Firebase Console에서 직접 권한 설정');
    console.log('3. 프론트엔드 Firebase 연결로 우회');
}

// 메인 실행
testPermissions()
    .then(() => {
        console.log('\n🏁 권한 확인 완료!');
        suggestSolutions();
    })
    .catch(console.error);
