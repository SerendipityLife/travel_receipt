const functions = require(\'firebase-functions\');
const admin = require(\'firebase-admin\');
const { ImageAnnotatorClient } = require(\'@google-cloud/vision\');
const { VertexAI } = require(\'@google-cloud/vertex-ai\');

// Firebase Admin SDK 초기화
admin.initializeApp();

// Google Cloud 클라이언트 초기화
const visionClient = new ImageAnnotatorClient();
const storage = admin.storage();

// Vertex AI 설정
const project = process.env.GCLOUD_PROJECT;
const location = \'asia-northeast3\'; // 서울 리전
const vertexAI = new VertexAI({ project, location });

// Gemini 모델 설정
const generativeModel = vertexAI.getGenerativeModel({
    model: \'gemini-1.0-pro\',
});

// Receipt TypeScript 인터페이스 정의 (AI 프롬프트에 사용)
const receiptInterface = `
// 영수증 타입
export interface Receipt extends FirestoreDocument {
    userId: string;
    tripId: string;

    // 기본 정보
    title: string;
    storeName: string;
    storeNameKr?: string;
    location?: string;
    date: Timestamp;

    // 금액 정보
    amount: number;
    currency: string;
    exchangeRate?: number;
    amountKr?: number;

    // 카테고리 및 태그
    category: string;
    tags: string[];
    notes?: string;

    // 영수증 상세 정보
    receiptDetails?: {
        receiptNo: string;
        cashierNo?: string;
        tel?: string;
        address?: string;
        addressKr?: string;
        time?: string;
        paymentMethod?: string;
        paymentMethodKr?: string;
        change?: number;
        changeKr?: number;
    };

    // 상품 목록
    items?: Array<{
        code?: string;
        name: string;
        nameKr?: string;
        price: number;
        priceKr?: number;
        quantity: number;
        tax?: string;
    }>;

    // 계산 정보
    subtotal?: number;
    subtotalKr?: number;
    tax?: number;
    taxKr?: number;
    total: number;
    totalKr?: number;

    // 이미지 정보
    imageUrl?: string;
    imageThumbnailUrl?: string;

    // OCR 처리 정보
    ocrProcessed?: boolean;
    ocrConfidence?: number;
}
`;

exports.processReceipt = functions.storage.object().onFinalize(async (object) => {
    const { bucket, name, contentType } = object;

    // 이미지가 아니거나, 이미 처리된 경우(예: 썸네일) 함수 종료
    if (!contentType.startsWith(\'image/\')) {
        console.log(\'This is not an image.\');
        return null;
    }

    console.log(`Processing file: ${name}`);

    try {
        // 1. Vision API로 OCR 수행
        const [result] = await visionClient.textDetection(`gs://${bucket}/${name}`);
        const ocrText = result.fullTextAnnotation?.text;

        if (!ocrText) {
            console.error(\'No text found in image.\');
            return null;
        }

        console.log(\'OCR Text extracted successfully.\');
        // console.log(\'OCR Text:\', ocrText); // 너무 길어서 비활성화

        // 2. Gemini AI로 영수증 파싱
        const prompt = `
            You are an intelligent assistant that parses Japanese receipt OCR text and converts it into a structured JSON object.
            Based on the following OCR text, extract the information and format it according to the provided TypeScript interface \'Receipt\'.

            **OCR Text:**
            ---
            ${ocrText}
            ---

            **TypeScript Interface for the output JSON:**
            ---
            ${receiptInterface}
            ---

            **Instructions:**
            1.  Analyze the OCR text to identify the store name, date, items, total amount, and other details.
            2.  \'userId\' and \'tripId\' should be set to "temp_user" and "temp_trip" respectively. These are placeholders.
            3.  \'date\' must be a valid ISO 8601 string.
            4.  \'items\' should be an array of objects, each with \'name\', \'price\', and \'quantity\'.
            5.  \'currency\' should be \'JPY\' for Japanese receipts.
            6.  If a value is not found in the text, omit the key from the final JSON.
            7.  Provide only the final JSON object in your response, without any surrounding text or markdown formatting.
        `;

        const resp = await generativeModel.generateContent({
            contents: [{ role: \'user\', parts: [{ text: prompt }] }],
        });
        
        const jsonResponseText = resp.response.candidates[0].content.parts[0].text.replace(/\\\`\\\`\\\`json/g, \'\').replace(/\\\`\\\`\\\`/g, \'\');
        const parsedData = JSON.parse(jsonResponseText);

        console.log(\'Receipt parsed by AI successfully.\');
        // console.log(\'Parsed Data:\', parsedData);

        // 3. Firestore에 저장
        const firestore = admin.firestore();
        const receiptRef = await firestore.collection(\'receipts\').add({
            ...parsedData,
            imageUrl: `gs://${bucket}/${name}`,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            ocrProcessed: true,
            ocrConfidence: result.fullTextAnnotation.pages.reduce((acc, page) => acc + page.confidence, 0) / result.fullTextAnnotation.pages.length,
        });

        console.log(`Successfully processed and saved receipt with ID: ${receiptRef.id}`);
        return receiptRef.id;

    } catch (error) {
        console.error(\'Error processing receipt:\', error);
        return null;
    }
});
