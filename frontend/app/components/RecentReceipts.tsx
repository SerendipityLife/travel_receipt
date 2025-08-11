'use client';

import Link from 'next/link';

interface Receipt {
  id: number;
  store: string;
  date: string;
  time: string;
  amount: number;
  category: string;
  items: number;
}

interface RecentReceiptsProps {
  receipts: Receipt[];
  onAddReceipt?: (receipt: Receipt) => void;
}

export default function RecentReceipts({ receipts, onAddReceipt }: RecentReceiptsProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">최근 영수증</h3>
        <Link 
          href="/receipt-scanner"
          className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors !rounded-button"
        >
          <i className="ri-add-line text-blue-600 text-lg"></i>
        </Link>
      </div>

      {receipts.length > 0 ? (
        <div className="space-y-4">
          {receipts.map((receipt) => (
            <Link key={receipt.id} href={`/receipt/${receipt.id}`}>
              <div className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 text-base leading-tight flex-1 mr-3 break-words">{receipt.store}</h4>
                  <span className="text-base font-bold text-gray-900 leading-tight break-words flex-shrink-0">₩{receipt.amount.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <i className="ri-calendar-line text-xs"></i>
                    <span className="leading-tight">{receipt.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-time-line text-xs"></i>
                    <span className="leading-tight">{receipt.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="ri-shopping-bag-line text-xs"></i>
                    <span className="leading-tight">{receipt.items}개</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-start">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 leading-tight">
                    {receipt.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          
          {receipts.length >= 3 && (
            <Link href="/receipts">
              <button className="w-full py-4 text-center text-blue-600 hover:text-blue-700 font-medium text-base transition-colors border border-gray-200 rounded-xl hover:bg-blue-50">
                모든 영수증 보기
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-receipt-line text-3xl text-gray-400"></i>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">아직 영수증이 없습니다</h4>
          <p className="text-gray-500 text-base mb-6">첫 번째 영수증을 추가해보세요!</p>
          <Link 
            href="/receipt-scanner"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors !rounded-button"
          >
            <i className="ri-camera-line text-xl"></i>
            영수증 스캔
          </Link>
        </div>
      )}
    </div>
  );
}