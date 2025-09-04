require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

async function testOcrApi() {
    try {
        console.log('=== 네이버 OCR API 테스트 ===');

        // 환경 변수 확인
        console.log('NAVER_OCR_INVOKE_URL:', process.env.NAVER_OCR_INVOKE_URL);
        console.log('NAVER_OCR_SECRET_KEY:', process.env.NAVER_OCR_SECRET_KEY ? '설정됨' : '설정되지 않음');

        // 테스트 이미지 읽기
        const imageBuffer = fs.readFileSync('./test_image.jpg');
        const imageBase64 = imageBuffer.toString('base64');
        console.log('이미지 크기:', imageBuffer.length, 'bytes');
        console.log('Base64 길이:', imageBase64.length);

        // 요청 본문 구성
        const requestBody = {
            images: [{
                format: 'jpg',
                name: 'receipt',
                data: imageBase64
            }],
            requestId: `test-${Date.now()}`,
            version: 'V2',
            timestamp: Date.now()
        };

        console.log('요청 본문 크기:', JSON.stringify(requestBody).length);

        // API 호출
        const response = await axios.post(
            process.env.NAVER_OCR_INVOKE_URL,
            requestBody,
            {
                headers: {
                    'X-OCR-SECRET': process.env.NAVER_OCR_SECRET_KEY,
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        console.log('응답 상태:', response.status);
        console.log('응답 데이터 키:', Object.keys(response.data));
        console.log('OCR 성공!');

    } catch (error) {
        console.error('OCR API 테스트 실패:');
        if (axios.isAxiosError(error)) {
            console.error('응답 상태:', error.response?.status);
            console.error('응답 데이터:', error.response?.data);
            console.error('요청 URL:', error.config?.url);
            console.error('요청 헤더:', error.config?.headers);
        } else {
            console.error('에러:', error.message);
        }
    }
}

testOcrApi();
