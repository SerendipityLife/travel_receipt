import { Router } from 'express';
import { analyzeReceipt, testReceipt } from '../../controllers/firestore/ocrController';

const router = Router();

// OCR 라우트 (인증 없이 접근 가능)
router.post('/analyze', analyzeReceipt);
router.post('/test', testReceipt);

export default router;
