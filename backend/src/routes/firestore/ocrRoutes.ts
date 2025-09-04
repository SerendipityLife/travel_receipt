import { Router } from 'express';
import { analyzeReceipt, testReceipt, parseReceiptWithAI } from '../../controllers/firestore/ocrController';

const router = Router();

// OCR 라우트 (인증 없이 접근 가능)
router.post('/analyze', analyzeReceipt);
router.post('/test', testReceipt);
router.post('/parse-ai', parseReceiptWithAI);

export default router;
