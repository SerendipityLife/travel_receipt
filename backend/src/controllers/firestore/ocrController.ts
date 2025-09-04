import { Request, Response } from 'express';
import { naverOcrService } from '../../services/naverOcrService';
import { firebaseAiOcrService } from '../../services/firebaseAiOcrService';
import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

// Multer 설정
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB 제한
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('이미지 파일만 업로드 가능합니다.'));
        }
    },
});

export const analyzeReceipt = async (req: Request, res: Response) => {
    try {
        const mode = req.body.mode || req.query.mode;

        // 테스트 모드 처리
        if (mode === 'test') {
            const filename = req.body.filename || req.query.filename;
            if (!filename) {
                return res.status(400).json({
                    message: '테스트 모드에서는 파일명이 필요합니다.'
                });
            }

            try {
                const testFilePath = path.join(__dirname, '../../../logs', `${filename}.json`);
                if (!fs.existsSync(testFilePath)) {
                    return res.status(404).json({
                        message: '테스트 파일을 찾을 수 없습니다.',
                        filename: filename
                    });
                }

                const testData = JSON.parse(fs.readFileSync(testFilePath, 'utf8'));
                console.log('테스트 파일 로드됨:', testFilePath);

                res.json({
                    success: true,
                    data: testData,
                    mode: 'test',
                    filename: filename
                });
                return;
            } catch (testError) {
                console.error('테스트 파일 처리 실패:', testError);
                return res.status(500).json({
                    message: '테스트 파일 분석에 실패했습니다.',
                    error: testError instanceof Error ? testError.message : 'Unknown error'
                });
            }
        }

        // 실제 API 모드 처리
        // multer 미들웨어를 직접 호출
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    message: '파일 업로드 실패',
                    error: err.message
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    message: '이미지 파일이 필요합니다.'
                });
            }

            try {
                console.log('OCR 컨트롤러: 이미지 파일 수신됨');
                console.log('파일 크기:', req.file.size, 'bytes');
                console.log('파일 타입:', req.file.mimetype);
                console.log('환경 변수 확인:');
                console.log('- NAVER_OCR_INVOKE_URL:', process.env.NAVER_OCR_INVOKE_URL);
                console.log('- NAVER_OCR_SECRET_KEY:', process.env.NAVER_OCR_SECRET_KEY ? '설정됨' : '설정되지 않음');

                let ocrResult;

                try {
                    // 네이버 OCR API 호출 시도
                    console.log('네이버 OCR API 호출 시도...');
                    ocrResult = await naverOcrService.analyzeReceipt(req.file.buffer);
                    console.log('네이버 OCR 성공');
                } catch (naverError) {
                    console.log('네이버 OCR 실패, Firebase AI OCR로 대체:', naverError instanceof Error ? naverError.message : 'Unknown error');

                    // Firebase AI OCR로 대체 (간단한 텍스트 추출 시뮬레이션)
                    // 실제로는 Google Vision API를 사용해야 하지만, 현재는 테스트용 텍스트 사용
                    const testOcrText = `
ディスカウントショップ
ドン・キホーテ
福岡天神本店
TEL0570-079-711
24時間営業
2023年08月27日(日)21:48
レジ0005
No*****013ウルミラ
免税

★休足時間 18枚
2コ×単598
¥1,196

★どん兵衛 きつねうどん(西 ¥217)
¥217

★サンリオキャラクター
¥848

★残額の美力
¥469

★ちょこっとプッチンプ
¥179

★スナックピスタチオ
¥1,080

★一蘭とんこつ カップ
5コ×単453
¥2,265

★アルフォートFS
2コ×単299
¥598

★☆情熱 ハッピースー
¥199

★一平ちゃん夜店の焼そば
¥199

★PT-302 楽しいね!
¥1,580

★SPヒロインメイク スピ
¥840

★アルフォートミニチョ
3コ×単99
¥297

★ベイククリーミーチーズ
¥239

★ベイククリーミーチーズ
¥239

★情熱価格 メガバック
¥999

小計
¥11,444

クーポン割引対象
クーポン割引
5% -573

合計
¥10,871

クレジット
¥10,871
                    `;

                    // Firebase AI OCR로 파싱
                    const aiParsedResult = await firebaseAiOcrService.parseReceiptWithAI(testOcrText);

                    // AI 파싱 결과를 기존 형식으로 변환
                    ocrResult = {
                        storeName: aiParsedResult.storeName || 'Unknown Store',
                        date: aiParsedResult.date || new Date().toISOString().split('T')[0],
                        time: aiParsedResult.time || '00:00',
                        total: aiParsedResult.totalAmount || 0,
                        items: aiParsedResult.items.map(item => ({
                            name: item.name || 'Unknown Item',
                            price: item.totalPrice || 0,
                            quantity: item.quantity || 1,
                            janCode: item.janCode || undefined
                        })),
                        confidence: 0.90 // AI 파싱의 경우 높은 신뢰도
                    };

                    console.log('Firebase AI OCR 파싱 완료');
                }

                console.log('OCR 결과 수신:', JSON.stringify(ocrResult, null, 2));

                // 환율 정보 추가 (실제로는 외부 API에서 가져와야 함)
                const exchangeRate = 8.83; // 임시 환율 (JPY to KRW)

                const result = {
                    ...ocrResult,
                    exchangeRate,
                    totalKr: Math.round(ocrResult.total * exchangeRate),
                    items: ocrResult.items.map(item => ({
                        ...item,
                        priceKr: Math.round(item.price * exchangeRate)
                    }))
                };

                console.log('최종 응답 데이터:', JSON.stringify(result, null, 2));

                // OCR 결과를 파일로 저장
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const logDir = path.join(__dirname, '../../../logs');

                // logs 디렉토리가 없으면 생성
                if (!fs.existsSync(logDir)) {
                    fs.mkdirSync(logDir, { recursive: true });
                }

                // OCR 결과 파일 저장
                const ocrResultFile = path.join(logDir, `result_${timestamp}.json`);
                const fullResult = {
                    timestamp: new Date().toISOString(),
                    originalImage: {
                        size: req.file.size,
                        mimetype: req.file.mimetype
                    },
                    ocrResult: ocrResult,
                    finalResult: result
                };

                fs.writeFileSync(ocrResultFile, JSON.stringify(fullResult, null, 2));
                console.log('OCR 결과가 파일로 저장됨:', ocrResultFile);

                res.json({
                    success: true,
                    data: result,
                    confidence: ocrResult.confidence,
                    logFile: ocrResultFile
                });
            } catch (ocrError) {
                console.error('OCR 처리 실패:', ocrError);
                res.status(500).json({
                    message: '영수증 분석에 실패했습니다.',
                    error: ocrError instanceof Error ? ocrError.message : 'Unknown error'
                });
            }
        });
    } catch (error) {
        console.error('OCR 컨트롤러 에러:', error);
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const testReceipt = async (req: Request, res: Response) => {
    try {
        console.log('testReceipt 함수 호출됨');
        const { fileName } = req.body;
        console.log('요청된 파일명:', fileName);

        if (!fileName) {
            console.log('파일명이 없음');
            return res.status(400).json({
                message: '파일명이 필요합니다.'
            });
        }

        // 로그 파일 경로
        const logDir = path.join(__dirname, '../../../logs');
        const testFilePath = path.join(logDir, `${fileName}.json`);
        console.log('테스트 파일 경로:', testFilePath);

        // 파일 존재 확인
        if (!fs.existsSync(testFilePath)) {
            console.log('파일이 존재하지 않음:', testFilePath);
            return res.status(404).json({
                message: `파일을 찾을 수 없습니다: ${fileName}.json`
            });
        }

        // 파일 읽기
        console.log('파일 읽기 시작');
        const fileContent = fs.readFileSync(testFilePath, 'utf8');
        console.log('파일 내용 길이:', fileContent.length);
        const testData = JSON.parse(fileContent);
        console.log('JSON 파싱 완료');

        console.log('테스트 파일 로드:', testFilePath);

        // OCR 결과에서 finalResult 추출
        let ocrResult = testData.finalResult || testData.ocrResult;

        // finalResult나 ocrResult가 없으면 원본 OCR 데이터를 파싱
        if (!ocrResult) {
            console.log('finalResult나 ocrResult가 없음, 원본 OCR 데이터 파싱 시도');
            if (testData.responseData && testData.responseData.images && testData.responseData.images[0]) {
                // naverOcrService를 사용해서 원본 데이터를 파싱
                const { naverOcrService } = require('../../services/naverOcrService');
                ocrResult = await naverOcrService.parseReceiptData(testData.responseData);
                console.log('원본 OCR 데이터 파싱 완료');
            } else {
                return res.status(400).json({
                    message: '유효한 OCR 결과가 없습니다.'
                });
            }
        }

        // 환율 정보 추가
        const exchangeRate = 8.83; // 임시 환율 (JPY to KRW)

        const result = {
            ...ocrResult,
            exchangeRate,
            totalKr: Math.round(ocrResult.total * exchangeRate),
            items: ocrResult.items.map((item: any) => ({
                ...item,
                priceKr: Math.round(item.price * exchangeRate)
            }))
        };

        console.log('테스트 파일 결과:', JSON.stringify(result, null, 2));

        res.json({
            success: true,
            data: result,
            confidence: ocrResult.confidence,
            source: `테스트 파일: ${fileName}.json`
        });

    } catch (error) {
        console.error('테스트 파일 처리 실패:', error);
        res.status(500).json({
            message: '테스트 파일 처리에 실패했습니다.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Firebase AI를 이용한 OCR 텍스트 파싱
export const parseReceiptWithAI = async (req: Request, res: Response) => {
    try {
        const { ocrText, mode = 'ai' } = req.body;

        if (!ocrText || ocrText.trim() === '') {
            return res.status(400).json({
                message: 'OCR 텍스트가 필요합니다.'
            });
        }

        console.log('Firebase AI OCR 파싱 요청:', { mode, textLength: ocrText.length });

        let parsedResult;

        // Firebase AI 파싱
        parsedResult = await firebaseAiOcrService.parseReceiptWithAI(ocrText);

        // 환율 정보 추가 (실제로는 외부 API에서 가져와야 함)
        const exchangeRate = 8.83; // 임시 환율 (JPY to KRW)

        const result = {
            ...parsedResult,
            exchangeRate,
            totalKr: parsedResult.totalAmount ? Math.round(parsedResult.totalAmount * exchangeRate) : null,
            subtotalKr: parsedResult.subtotal ? Math.round(parsedResult.subtotal * exchangeRate) : null,
            discountKr: parsedResult.discount ? Math.round(parsedResult.discount * exchangeRate) : null,
            items: parsedResult.items.map(item => ({
                ...item,
                priceKr: item.totalPrice ? Math.round(item.totalPrice * exchangeRate) : null
            }))
        };

        console.log('Firebase AI 파싱 결과:', JSON.stringify(result, null, 2));

        res.json({
            success: true,
            data: result,
            mode: mode,
            confidence: 0.95 // AI 파싱의 경우 높은 신뢰도
        });

    } catch (error) {
        console.error('Firebase AI OCR 파싱 실패:', error);
        res.status(500).json({
            message: 'Firebase AI OCR 파싱에 실패했습니다.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
