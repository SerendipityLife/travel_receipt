import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Firebase Admin SDK 초기화
const initializeFirebaseAdmin = () => {
    if (getApps().length === 0) {
        // 서비스 계정 키 파일 경로 또는 환경 변수에서 설정
        const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
            ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
            : undefined;

        if (serviceAccount) {
            initializeApp({
                credential: cert(serviceAccount),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET
            });
        } else {
            // 개발 환경에서는 기본 인증 사용 (GOOGLE_APPLICATION_CREDENTIALS 환경 변수)
            initializeApp({
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET
            });
        }

        // Firestore 설정 (한 번만 호출)
        const db = getFirestore();
        db.settings({
            ignoreUndefinedProperties: true
        });
    }
};

// Firestore 데이터베이스 초기화
export const getFirestoreDB = () => {
    initializeFirebaseAdmin();
    return getFirestore();
};

// Firebase Auth 초기화
export const getFirebaseAuth = () => {
    initializeFirebaseAdmin();
    return getAuth();
};

// Firebase Storage 초기화
export const getFirebaseStorage = () => {
    initializeFirebaseAdmin();
    return getStorage();
};

export default initializeFirebaseAdmin;
