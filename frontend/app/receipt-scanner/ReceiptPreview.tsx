
'use client';

interface ReceiptPreviewProps {
  receipt: {
    store: string;
    date: string;
    time: string;
    items: Array<{
      name: string;
      nameKr: string;
      price: number;
      quantity: number;
    }>;
    total: number;
    totalKrw: number;
    exchangeRate: number;
  };
  onEdit: () => void;
  onSave: () => void;
}

export default function ReceiptPreview({ receipt, onEdit, onSave }: ReceiptPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">영수증 처리 완료</h2>
          <p className="text-gray-600">아래 내용을 확인해주세요</p>
        </div>

        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 mb-6">
          <div className="text-center mb-4">
            <h3 className="font-bold text-lg">{receipt.store}</h3>
            <p className="text-gray-600">{receipt.date} {receipt.time}</p>
          </div>

          <div className="space-y-3">
            {receipt.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.nameKr}</div>
                  <div className="text-sm text-gray-500">{item.name}</div>
                  <div className="text-xs text-gray-400">수량: {item.quantity}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">¥{item.price}</div>
                  <div className="text-sm text-gray-500">₩{Math.round(item.price * receipt.exchangeRate)}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-gray-300 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">합계</span>
              <div className="text-right">
                <div className="font-bold text-lg">¥{receipt.total}</div>
                <div className="text-blue-600 font-semibold">₩{receipt.totalKrw.toLocaleString()}</div>
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">
              환율: ¥1 = ₩{receipt.exchangeRate}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-4 !rounded-button hover:border-gray-400 transition-colors"
          >
            <i className="ri-edit-line mr-2"></i>
            내용 수정
          </button>
          <button className="flex-1 bg-blue-600 text-white py-3 px-4 !rounded-button hover:bg-blue-700 transition-colors">
            <i className="ri-save-line mr-2"></i>
            영수증 저장
          </button>
        </div>
      </div>

      <div className="bg-green-50 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <i className="ri-check-line text-green-600"></i>
          </div>
          <div>
            <h4 className="font-semibold text-green-900 mb-1">처리 완료</h4>
            <p className="text-sm text-green-800">모든 상품이 번역되고 분류되었습니다. {receipt.date} 기준 환율로 환전이 적용되었습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
