require('dotenv').config();

console.log('=== 환경 변수 테스트 ===');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NAVER_OCR_INVOKE_URL:', process.env.NAVER_OCR_INVOKE_URL);
console.log('NAVER_OCR_SECRET_KEY:', process.env.NAVER_OCR_SECRET_KEY ? '설정됨' : '설정되지 않음');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('========================');
