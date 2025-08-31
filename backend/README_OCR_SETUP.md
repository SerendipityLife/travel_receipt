# 네이버 클라우드 CLOVA OCR API Gateway 설정 가이드

## 1. 네이버 클라우드 플랫폼 가입
- https://www.ncloud.com/ 에서 가입
- AI·NAVER API → CLOVA OCR 서비스 신청

## 2. CLOVA OCR 빌더에서 도메인 생성
1. **CLOVA OCR 빌더 접속**
   - 네이버 클라우드 플랫폼 콘솔 → AI·NAVER API → CLOVA OCR → 빌더

2. **도메인 생성**
   - [도메인 생성] 버튼 클릭
   - 도메인명 입력 (예: `travel-receipt-ocr`)
   - 생성 완료

## 3. API Gateway 자동 연동
1. **Secret Key 생성**
   - OCR 빌더에서 [Secret Key 생성] 버튼 클릭
   - 생성된 Secret Key 복사

2. **API Gateway 자동 연동**
   - [API Gateway 자동 연동] 버튼 클릭
   - 연동 완료 후 OCR Invoke URL 복사

## 4. 환경 변수 설정
`backend/.env` 파일에 다음 내용 추가:

```bash
# Naver Cloud CLOVA OCR API Gateway Configuration
NAVER_OCR_INVOKE_URL=https://your-api-gateway-url.apigw.ntruss.com/your-stage/your-resource
NAVER_OCR_SECRET_KEY=your-secret-key-here
```

## 5. API 호출 테스트
Postman으로 테스트:

```
POST {NAVER_OCR_INVOKE_URL}
Headers:
  Content-Type: application/octet-stream
  X-OCR-SECRET: {NAVER_OCR_SECRET_KEY}

Body:
  Binary (이미지 파일)
```

## 6. 응답 형식
```json
{
  "images": [
    {
      "fields": [
        {
          "name": "text",
          "boundingPoly": {
            "vertices": [
              {"x": 100, "y": 100},
              {"x": 200, "y": 100},
              {"x": 200, "y": 150},
              {"x": 100, "y": 150}
            ]
          },
          "inferText": "인식된 텍스트",
          "inferConfidence": 0.95
        }
      ]
    }
  ]
}
```

## 7. 주의사항
- API Gateway URL은 보안을 위해 외부에 노출하지 마세요
- Secret Key는 절대 공개 저장소에 커밋하지 마세요
- 이미지 파일 크기는 10MB 이하로 제한됩니다
- 지원 이미지 형식: JPG, PNG, BMP, TIFF

## 8. 문제 해결
- **403 에러**: Secret Key 확인
- **404 에러**: Invoke URL 확인
- **413 에러**: 이미지 파일 크기 초과
- **415 에러**: 지원하지 않는 이미지 형식
