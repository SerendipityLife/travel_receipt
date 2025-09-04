import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { firebaseAiOcrService } from './firebaseAiOcrService';

interface ReceiptOcrResult {
    storeName: string;
    date: string;
    time: string;
    total: number;
    items: Array<{
        name: string;
        price: number;
        quantity: number;
        janCode?: string;
    }>;
    confidence: number;
}

export class NaverOcrService {
    constructor() {
        // 기본 생성자
    }

    async analyzeReceipt(imageBuffer: Buffer): Promise<ReceiptOcrResult> {
        try {
            console.log('네이버 OCR API 호출 시작...');

            // 이미지 버퍼를 base64로 인코딩
            const imageBase64 = imageBuffer.toString('base64');
            console.log('이미지 base64 길이:', imageBase64.length);

            // 이미지 크기 검증 (네이버 클라우드 OCR API 제한사항)
            if (imageBase64.length > 20 * 1024 * 1024) { // 20MB 제한
                throw new Error('이미지 크기가 너무 큽니다. 20MB 이하의 이미지를 사용해주세요.');
            }

            // 네이버 클라우드 OCR API 예제에 따른 요청 형식
            const requestBody = {
                images: [{
                    format: 'jpg',
                    name: 'receipt',
                    data: imageBase64
                }],
                requestId: `receipt-${Date.now()}`,
                version: 'V2',
                timestamp: Date.now()
            };

            console.log('Naver OCR API 요청 URL:', process.env.NAVER_OCR_INVOKE_URL);
            console.log('Naver OCR API 요청 본문 크기:', JSON.stringify(requestBody).length);

            const response = await axios.post(
                process.env.NAVER_OCR_INVOKE_URL!,
                requestBody,
                {
                    headers: {
                        'X-OCR-SECRET': process.env.NAVER_OCR_SECRET_KEY!,
                        'Content-Type': 'application/json'
                    },
                    timeout: 60000
                }
            );

            console.log('네이버 OCR API 응답 성공');
            console.log('응답 데이터 구조:', Object.keys(response.data));

            // 응답 데이터 검증
            if (!response.data || !response.data.images || !response.data.images[0]) {
                throw new Error('OCR API 응답 데이터가 올바르지 않습니다.');
            }

            const ocrResult = response.data.images[0];
            if (!ocrResult.fields || ocrResult.fields.length === 0) {
                throw new Error('OCR에서 텍스트를 인식하지 못했습니다. 이미지를 다시 촬영해주세요.');
            }

            // Raw OCR 응답 데이터를 파일로 저장
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const logDir = path.join(__dirname, '../../logs');

            // logs 디렉토리가 없으면 생성
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }

            // Raw OCR 응답 파일 저장
            const rawOcrFile = path.join(logDir, `raw_${timestamp}.json`);
            const rawData = {
                timestamp: new Date().toISOString(),
                requestUrl: process.env.NAVER_OCR_INVOKE_URL,
                responseStatus: response.status,
                responseData: response.data
            };

            fs.writeFileSync(rawOcrFile, JSON.stringify(rawData, null, 2));
            console.log('Raw OCR 응답이 파일로 저장됨:', rawOcrFile);

            // 하이브리드 파싱: 규칙 기반만 사용
            return await this.parseReceiptData(response.data);
        } catch (error) {
            console.error('OCR API 호출 실패:', error);
            if (axios.isAxiosError(error)) {
                console.error('응답 상태:', error.response?.status);
                console.error('응답 데이터:', error.response?.data);
                console.error('요청 URL:', error.config?.url);
                console.error('요청 헤더:', error.config?.headers);
                console.error('요청 데이터 크기:', error.config?.data ? JSON.stringify(error.config.data).length : 'N/A');

                // 네이버 클라우드 OCR API 에러 코드별 처리
                if (error.response?.status === 400) {
                    throw new Error('잘못된 요청 형식: 이미지 데이터를 확인해주세요');
                } else if (error.response?.status === 401) {
                    throw new Error('인증 실패: API 키를 확인해주세요');
                } else if (error.response?.status === 429) {
                    throw new Error('요청 한도 초과: 잠시 후 다시 시도해주세요');
                } else if (error.response?.status === 500) {
                    throw new Error('서버 오류: 잠시 후 다시 시도해주세요');
                }
            }
            throw new Error('OCR API 호출 실패: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    public async parseReceiptData(responseData: any): Promise<ReceiptOcrResult> {
        console.log('OCR 데이터 파싱 시작...');

        // 네이버 OCR API 응답 구조 확인 및 처리
        let fields: any[] = [];

        if (responseData.images && responseData.images[0] && responseData.images[0].fields) {
            // V2 형식 응답
            fields = responseData.images[0].fields;
        } else if (responseData.result && responseData.result.fields) {
            // V1 형식 응답
            fields = responseData.result.fields;
        } else {
            console.error('지원되지 않는 OCR 응답 형식:', responseData);
            throw new Error('유효하지 않은 OCR 응답 데이터');
        }

        console.log('인식된 필드 수:', fields.length);
        console.log('응답 데이터 구조:', Object.keys(responseData));

        // OCR 텍스트 추출
        const ocrText = fields.map(field => field.inferText).join('\n');
        console.log('추출된 OCR 텍스트:', ocrText);

        // Firebase AI 파싱
        console.log('Firebase AI 파싱 시도...');
        const aiParsedResult = await firebaseAiOcrService.parseReceiptWithAI(ocrText);
        
        // AI 파싱 결과를 기존 형식으로 변환
        return {
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
            confidence: 0.95 // AI 파싱의 경우 높은 신뢰도
        };
    }
}

export const naverOcrService = new NaverOcrService();


