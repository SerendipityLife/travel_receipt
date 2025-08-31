import { Router } from 'express';
import {
    getUserProfile,
    updateUserProfile,
    createUserProfile,
    deleteUserProfile,
    getUserSettings,
    updateUserSettings,
    getUserStats,
    verifyToken
} from '../../controllers/firestore/userController';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

// 사용자 프로필 관련 라우트 (인증 필요)
router.use(authMiddleware);

router.get('/profile', getUserProfile);           // 사용자 프로필 조회
router.put('/profile', updateUserProfile);        // 사용자 프로필 수정
router.post('/profile', createUserProfile);       // 사용자 프로필 생성
router.delete('/profile', deleteUserProfile);     // 사용자 프로필 삭제

// 사용자 설정 관련 라우트
router.get('/settings', getUserSettings);         // 사용자 설정 조회
router.put('/settings', updateUserSettings);      // 사용자 설정 수정

// 사용자 통계
router.get('/stats', getUserStats);               // 사용자 통계 조회

// 토큰 검증 (인증 미들웨어 없이)
router.post('/verify-token', verifyToken);        // Firebase 토큰 검증

export default router;
