import axios from 'axios';
import { FirebaseAiService } from './firebaseAiService';

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
    private firebaseAiService: FirebaseAiService;

    constructor() {
        this.firebaseAiService = new FirebaseAiService();
    }

    async analyzeReceipt(imageBase64: string): Promise<ReceiptOcrResult> {
        try {
            console.log('네이버 OCR API 호출 시작...');

            const response = await axios.post(
                process.env.NAVER_OCR_INVOKE_URL!,
                {
                    images: [{
                        format: 'jpg',
                        name: 'receipt',
                        data: imageBase64
                    }],
                    requestId: `receipt-${Date.now()}`,
                    version: 'V2',
                    timestamp: Date.now()
                },
                {
                    headers: {
                        'X-OCR-SECRET': process.env.NAVER_OCR_SECRET_KEY!,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('네이버 OCR API 응답 성공');
            return await this.parseReceiptData(response.data);
        } catch (error) {
            console.error('OCR API 호출 실패:', error);
            throw new Error('OCR API 호출 실패: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }

    public async parseReceiptData(responseData: any): Promise<ReceiptOcrResult> {
        console.log('OCR 데이터 파싱 시작...');

        if (!responseData.images || !responseData.images[0] || !responseData.images[0].fields) {
            throw new Error('유효하지 않은 OCR 응답 데이터');
        }

        const fields = responseData.images[0].fields;
        console.log('인식된 필드 수:', fields.length);

        // Firebase AI Logic을 사용한 파싱 시도
        console.log('Firebase AI Logic을 사용한 파싱 시도...');
        try {
            const aiResult = await this.firebaseAiService.parseReceiptWithAI(fields);
            console.log('Firebase AI Logic 파싱 성공:', aiResult);
            return aiResult;
        } catch (aiError) {
            console.error('Firebase AI Logic 파싱 실패:', aiError);
            // 폴백 비활성화 - 실제 Firebase AI Logic 호출 확인을 위해
            throw new Error('Firebase AI Logic 호출 실패 - 폴백 비활성화됨: ' + (aiError instanceof Error ? aiError.message : 'Unknown error'));
        }
    }

    private extractStoreName(fields: any[]): string {
        const texts = fields.map(field => field.inferText.trim());

        // 매장명 패턴 찾기 (일반적인 패턴)
        const storePatterns = [
            /.*店$/,  // ~점
            /.*ショップ$/,  // ~샵
            /.*マート$/,  // ~마트
            /.*スーパー$/,  // ~슈퍼
        ];

        for (const text of texts) {
            for (const pattern of storePatterns) {
                if (pattern.test(text) && text.length > 2) {
                    return text;
                }
            }
        }

        // 매장 관련 키워드가 포함된 텍스트 찾기
        for (const text of texts) {
            if (text.includes('店') || text.includes('ショップ') || text.includes('マート') ||
                text.includes('スーパー') || text.includes('ディスカウント')) {
                return text;
            }
        }

        // 첫 번째 유효한 텍스트 반환
        for (const text of texts) {
            if (text.length > 2 && !text.match(/^\d+$/) && !text.includes('¥')) {
                return text;
            }
        }

        return 'Unknown Store';
    }

    private extractDate(fields: any[]): string {
        const texts = fields.map(field => field.inferText.trim());

        // 날짜 패턴 찾기
        const datePatterns = [
            /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
            /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,
            /(\d{4})年(\d{1,2})月(\d{1,2})日/
        ];

        for (const text of texts) {
            for (const pattern of datePatterns) {
                const match = text.match(pattern);
                if (match) {
                    if (match[1].length === 4) {
                        return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
                    } else {
                        return `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`;
                    }
                }
            }
        }

        return new Date().toISOString().split('T')[0];
    }

    private extractTime(fields: any[]): string {
        const texts = fields.map(field => field.inferText.trim());

        // 시간 패턴 찾기
        const timePattern = /(\d{1,2}):(\d{2})(?::(\d{2}))?/;

        for (const text of texts) {
            const match = text.match(timePattern);
            if (match) {
                return `${match[1].padStart(2, '0')}:${match[2]}`;
            }
        }

        return '00:00';
    }

    private extractTotal(fields: any[]): number {
        const texts = fields.map(field => field.inferText.trim());

        // 총액 패턴 찾기
        const totalPatterns = [
            /合計[:\s]*¥?([0-9,]+)/,
            /TOTAL[:\s]*¥?([0-9,]+)/,
            /小計[:\s]*¥?([0-9,]+)/,
            /¥([0-9,]+)/
        ];

        let maxAmount = 0;

        for (const text of texts) {
            for (const pattern of totalPatterns) {
                const match = text.match(pattern);
                if (match) {
                    const amount = parseInt(match[1].replace(/,/g, ''));
                    if (amount > maxAmount && amount < 100000) { // 합리적인 범위 체크
                        maxAmount = amount;
                    }
                }
            }
        }

        return maxAmount > 0 ? maxAmount : 0;
    }

    private extractItems(fields: any[]): Array<{ name: string; price: number; quantity: number; janCode?: string }> {
        const items: Array<{ name: string; price: number; quantity: number; janCode?: string }> = [];
        const pricePattern = /¥([0-9,]+)/;

        // 가격이 있는 필드들을 찾아서 상품 정보로 추정
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const text = field.inferText.trim();
            const priceMatch = text.match(pricePattern);

            if (priceMatch) {
                const price = parseInt(priceMatch[1].replace(/,/g, ''));

                // 합리적인 가격 범위 체크
                if (price >= 100 && price <= 100000) {
                    // JAN 코드 찾기
                    let janCode = '';
                    for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
                        const prevField = fields[j];
                        const prevText = prevField.inferText.trim();
                        const janMatch = prevText.match(/^(\d{13})JAN$/);
                        if (janMatch) {
                            janCode = janMatch[1];
                            break;
                        }
                    }

                    // 상품명 찾기
                    let itemName = '';
                    const namePart = text.replace(pricePattern, '').trim();

                    if (namePart.length > 0) {
                        itemName = namePart;
                    } else {
                        // 이전 필드에서 상품명 찾기
                        for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
                            const prevField = fields[j];
                            const prevText = prevField.inferText.trim();

                            if (!prevText.match(pricePattern) &&
                                !prevText.match(/^\d+$/) &&
                                !prevText.match(/^[A-Z0-9]+$/) &&
                                !prevText.match(/^[*():%\s]+$/) &&
                                prevText.length > 1) {
                                itemName = prevText;
                                break;
                            }
                        }
                    }

                    // 상품명이 유효한 경우에만 추가
                    if (itemName && itemName.length > 0) {
                        items.push({
                            name: itemName,
                            price: price,
                            quantity: 1,
                            janCode: janCode
                        });
                    }
                }
            }
        }

        console.log('추출된 상품 목록:', items);
        return items.slice(0, 10); // 최대 10개 상품만 반환
    }
}

export const naverOcrService = new NaverOcrService();


