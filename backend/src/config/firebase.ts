import admin from 'firebase-admin';

// Firebase Admin SDK 초기화 함수
const initializeFirebaseAdmin = () => {
    if (!admin.apps.length) {
        let credential;

        // 서비스 계정 키가 환경 변수에 있는 경우
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            try {
                const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
                credential = admin.credential.cert(serviceAccount);
            } catch (error) {
                console.error('서비스 계정 키 파싱 오류:', error);
                credential = admin.credential.applicationDefault();
            }
        } else {
            credential = admin.credential.applicationDefault();
        }

        admin.initializeApp({
            credential,
            projectId: process.env.FIREBASE_PROJECT_ID,
        });

        // Firestore 설정 (초기화 직후에만 가능)
        const db = admin.firestore();
        db.settings({ ignoreUndefinedProperties: true });
    }
    return admin;
};

// Firestore 데이터베이스 인스턴스 반환 함수
export const getFirestoreDB = () => {
    if (!admin.apps.length) {
        initializeFirebaseAdmin();
    }
    return admin.firestore();
};

export default initializeFirebaseAdmin;
