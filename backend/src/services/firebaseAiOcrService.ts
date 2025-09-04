import { PredictionServiceClient } from '@google-cloud/aiplatform';

// 파싱된 영수증 데이터의 타입 정의
interface ParsedReceipt {
    storeName: string | null;
    date: string | null;
    time: string | null;
    totalAmount: number | null;
    subtotal: number | null;
    discount: number | null;
    tax: number | null;
    items: Array<{
        name: string | null;
        quantity: number | null;
        unitPrice: number | null;
        totalPrice: number | null;
        janCode: string | null;
    }>;
    currency: string | null;
}

export class FirebaseAiOcrService {
    constructor() {
        // 기본 생성자
    }

    async parseReceiptWithAI(ocrText: string): Promise<ParsedReceipt> {
        try {
            console.log('일본 영수증 파싱 시작...');

            if (!ocrText || ocrText.trim() === '') {
                throw new Error('OCR 텍스트가 비어있습니다.');
            }

            // 간단한 로컬 파싱 로직 (일본 돈키호테 영수증 최적화)
            return this.parseJapaneseReceipt(ocrText);

        } catch (err: unknown) {
            console.error("일본 영수증 파싱 중 오류 발생:", err);
            let errorMessage = "알 수 없는 오류가 발생했습니다.";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            throw new Error(`일본 영수증 파싱 실패: ${errorMessage}`);
        }
    }

    private parseJapaneseReceipt(ocrText: string): ParsedReceipt {
        const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        let storeName: string | null = null;
        let date: string | null = null;
        let time: string | null = null;
        let totalAmount: number | null = null;
        let subtotal: number | null = null;
        let discount: number | null = null;
        let currency: string | null = 'JPY';
        const items: Array<{ name: string | null; quantity: number | null; unitPrice: number | null; totalPrice: number | null; janCode: string | null }> = [];

        // 매장명 찾기 (ドン・キホーテ 또는 다른 일본 매장명)
        for (const line of lines) {
            if (line.includes('ドン・キホーテ') || line.includes('ディスカウントショップ')) {
                storeName = line;
                break;
            }
        }

        // 날짜 찾기 (YYYY年MM月DD일 형식)
        const datePattern = /(\d{4})年(\d{1,2})月(\d{1,2})日/;
        for (const line of lines) {
            const match = line.match(datePattern);
            if (match) {
                date = `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
                break;
            }
        }

        // 시간 찾기 (HH:MM 형식)
        const timePattern = /(\d{1,2}):(\d{2})/;
        for (const line of lines) {
            const match = line.match(timePattern);
            if (match) {
                time = `${match[1].padStart(2, '0')}:${match[2]}`;
                break;
            }
        }

        // 총액 찾기 (合計)
        const totalPattern = /合計\s*¥?([0-9,]+)/;
        for (const line of lines) {
            const match = line.match(totalPattern);
            if (match) {
                totalAmount = parseInt(match[1].replace(/,/g, ''));
                break;
            }
        }

        // 소계 찾기 (小計)
        const subtotalPattern = /小計\s*¥?([0-9,]+)/;
        for (const line of lines) {
            const match = line.match(subtotalPattern);
            if (match) {
                subtotal = parseInt(match[1].replace(/,/g, ''));
                break;
            }
        }

        // 할인 찾기 (クーポン割引)
        const discountPattern = /クーポン割引\s*¥?([0-9,]+)/;
        for (const line of lines) {
            const match = line.match(discountPattern);
            if (match) {
                discount = -parseInt(match[1].replace(/,/g, ''));
                break;
            }
        }

        // 상품 항목 찾기 (가격이 있는 라인들)
        const pricePattern = /¥([0-9,]+)/;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const priceMatch = line.match(pricePattern);
            
            if (priceMatch) {
                const price = parseInt(priceMatch[1].replace(/,/g, ''));
                if (price >= 100 && price <= 100000) {
                    // JAN 코드 찾기 (13자리 숫자)
                    let janCode: string | null = null;
                    for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
                        const nextLine = lines[j];
                        const janMatch = nextLine.match(/^(\d{13})$/);
                        if (janMatch) {
                            janCode = janMatch[1];
                            break;
                        }
                    }

                    // 상품명 찾기 (가격 라인에서 ¥ 제거)
                    let itemName = line.replace(pricePattern, '').trim();
                    
                    // 수량 정보 찾기 (Nコ×단가 형식)
                    let quantity = 1;
                    let unitPrice = price;
                    const quantityPattern = /(\d+)コ×単(\d+)/;
                    for (let j = i - 1; j >= Math.max(0, i - 2); j--) {
                        const prevLine = lines[j];
                        const qMatch = prevLine.match(quantityPattern);
                        if (qMatch) {
                            quantity = parseInt(qMatch[1]);
                            unitPrice = parseInt(qMatch[2]);
                            break;
                        }
                    }

                    // 상품명이 유효한 경우에만 추가
                    if (itemName && itemName.length > 0 && !itemName.match(/^[0-9]+$/)) {
                        items.push({
                            name: itemName,
                            quantity: quantity,
                            unitPrice: unitPrice,
                            totalPrice: price,
                            janCode: janCode
                        });
                    }
                }
            }
        }

        return {
            storeName,
            date,
            time,
            totalAmount,
            subtotal,
            discount,
            tax: null, // 일본 영수증에서는 세금 정보가 별도로 표시되지 않음
            items: items.slice(0, 20), // 최대 20개 상품만 반환
            currency
        };
    }
}

export const firebaseAiOcrService = new FirebaseAiOcrService();
