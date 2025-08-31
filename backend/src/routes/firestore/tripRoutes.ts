import { Router } from 'express';
import {
    getTrips,
    getTripById,
    createNewTrip,
    updateTripById,
    deleteTripById,
    getTripStats,
    addTripMember,
    removeTripMember
} from '../../controllers/firestore/tripController';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(authMiddleware);

// 여행 관련 라우트
router.get('/', getTrips);                    // 사용자의 모든 여행 조회
router.get('/:id', getTripById);              // 특정 여행 조회
router.post('/', createNewTrip);              // 새 여행 생성
router.put('/:id', updateTripById);           // 여행 정보 수정
router.delete('/:id', deleteTripById);        // 여행 삭제

// 여행 통계
router.get('/:id/stats', getTripStats);       // 여행 통계 조회

// 멤버 관리
router.post('/:id/members', addTripMember);   // 멤버 추가
router.delete('/:id/members/:memberId', removeTripMember); // 멤버 제거

export default router;
