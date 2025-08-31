// 간단한 Firebase 연결 테스트
require('dotenv').config();
const admin = require('firebase-admin');

console.log('🔍 Firebase 연결 테스트 시작...');

// Firebase Admin SDK 초기화
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
    });

    console.log('✅ Firebase Admin SDK 초기화 성공');

    // 간단한 테스트: 프로젝트 정보 확인
    const projectId = admin.app().options.projectId;
    console.log('📋 프로젝트 ID:', projectId);

    // Firestore 연결 테스트
    const db = admin.firestore();
    console.log('✅ Firestore 연결 성공');

    // 간단한 문서 읽기 테스트
    const testDoc = db.collection('test').doc('connection');

    testDoc.get()
        .then((doc) => {
            if (doc.exists) {
                console.log('✅ Firestore 읽기 테스트 성공');
                console.log('📄 문서 데이터:', doc.data());
            } else {
                console.log('ℹ️ 테스트 문서가 존재하지 않습니다. 새로 생성합니다.');

                // 테스트 문서 생성
                return testDoc.set({
                    message: 'Firebase 연결 테스트 성공!',
                    timestamp: new Date(),
                    test: true
                });
            }
        })
        .then(() => {
            console.log('✅ Firestore 쓰기 테스트 성공');
            console.log('🎉 모든 Firebase 테스트 통과!');
        })
        .catch((error) => {
            console.error('❌ Firestore 테스트 실패:', error.message);
        });

} catch (error) {
    console.error('❌ Firebase 초기화 실패:', error.message);

    if (error.message.includes('Unexpected token')) {
        console.log('💡 서비스 계정 키 JSON 파싱 오류. 키가 올바른 JSON 형식인지 확인해주세요.');
    }
}
