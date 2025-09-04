const axios = require('axios');

// 일본 돈키호테 영수증 테스트용 OCR 텍스트
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
4903301138525

★どん兵衛 きつねうどん(西 ¥217)
¥217
4902105002674

★サンリオキャラクター
¥848
4521121152370

★残額の美力
¥469
4531915015248

★ちょこっとプッチンプ
¥179
4971666489040

★スナックピスタチオ
¥1,080
4974120402876

★一蘭とんこつ カップ
5コ×単453
¥2,265
4562214821254

★アルフォートFS
2コ×単299
¥598
4901360354221

★☆情熱 ハッピースー
¥199
4582409182632

★一平ちゃん夜店の焼そば
¥199
4902881048651

★PT-302 楽しいね!
¥1,580
4970381517397

★SPヒロインメイク スピ
¥840
4901433081474

★アルフォートミニチョ
3コ×単99
¥297
4901360353606

★ベイククリーミーチーズ
¥239
4902888263118

★ベイククリーミーチーズ
¥239
4902888209482

★情熱価格 メガバック
¥999
4955559343732

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

async function testFirebaseAiParsing() {
    try {
        console.log('일본 돈키호테 영수증 Firebase AI OCR 파싱 테스트 시작...');
        
        const response = await axios.post('http://localhost:5001/api/ocr/parse-ai', {
            ocrText: testOcrText
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('응답 상태:', response.status);
        console.log('응답 데이터:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('테스트 실패:', error.response?.data || error.message);
    }
}

// 테스트 실행
testFirebaseAiParsing();
