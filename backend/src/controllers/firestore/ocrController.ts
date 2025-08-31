import { Request, Response } from 'express';
import { naverOcrService } from '../../services/naverOcrService';
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

                // 네이버 OCR API 호출
                const ocrResult = await naverOcrService.analyzeReceipt(req.file.buffer);

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
                const ocrResultFile = path.join(logDir, `ocr-result-${timestamp}.json`);
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
