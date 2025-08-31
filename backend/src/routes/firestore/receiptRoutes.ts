import { Router } from 'express';
import {
    getReceipts,
    getReceiptsByTripId,
    getReceiptById,
    createNewReceipt,
    updateReceiptById,
    deleteReceiptById,
    getReceiptsByCategory,
    getReceiptsByDateRange
} from '../../controllers/firestore/receiptController';
import { authMiddleware } from '../../middleware/authMiddleware';

const router = Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(authMiddleware);

// 영수증 관련 라우트
router.get('/', getReceipts);                          // 사용자의 모든 영수증 조회
router.get('/trip/:tripId', getReceiptsByTripId);     // 특정 여행의 영수증 조회
router.get('/category/:category', getReceiptsByCategory); // 카테고리별 영수증 조회
router.get('/date-range', getReceiptsByDateRange);    // 날짜 범위별 영수증 조회
router.get('/:id', getReceiptById);                   // 특정 영수증 조회
router.post('/', createNewReceipt);                   // 새 영수증 생성
router.put('/:id', updateReceiptById);                // 영수증 정보 수정
router.delete('/:id', deleteReceiptById);             // 영수증 삭제

export default router;
