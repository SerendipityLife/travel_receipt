'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ReceiptDetailProps {
  receiptId: string;
}

export default function ReceiptDetail({ receiptId }: ReceiptDetailProps) {
  const [receipt] = useState({
    id: 1,
    store: "ドン・キホーテ 渋谷店",
    storeKr: "돈키호테 시부야점",
    tel: "03-5428-4086",
    address: "東京都渋谷区宇田川町28-6",
    addressKr: "도쿄도 시부야구 우다가와초 28-6",
    date: "2024-11-16",
    time: "14:32:18",
    receiptNo: "0005",
    cashierNo: "013-018",
    items: [
      {
        code: "4902102070744",
        name: "キットカット 抹茶",
        nameKr: "킷캣 말차",
        price: 298,
        priceKr: 2634,
        quantity: 2,
        tax: "外税"
      },
      {
        code: "4901330540074",
        name: "ポッキー チョコレート",
        nameKr: "포키 초콜릿",
        price: 158,
        priceKr: 1397,
        quantity: 1,
        tax: "外税"
      },
      {
        code: "4901777317109",
        name: "ラムネ サイダー",
        nameKr: "라무네 사이다",
        price: 120,
        priceKr: 1061,
        quantity: 3,
        tax: "内税"
      },
      {
        code: "4902555217840",
        name: "じゃがりこ サラダ",
        nameKr: "자가리코 샐러드",
        price: 160,
        priceKr: 1414,
        quantity: 1,
        tax: "外税"
      },
      {
        code: "4901330915728",
        name: "ハイチュウ グレープ",
        nameKr: "하이츄 포도",
        price: 138,
        priceKr: 1220,
        quantity: 2,
        tax: "外税"
      }
    ],
    subtotal: 1392,
    subtotalKr: 12307,
    tax: 111,
    taxKr: 981,
    total: 1503,
    totalKr: 13288,
    exchangeRate: 8.84,
    paymentMethod: "現金",
    paymentMethodKr: "현금",
    change: 497,
    changeKr: 4393
  });

  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <div className="bg-white px-4 py-6 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="w-10 h-10 flex items-center justify-center !rounded-button hover:bg-gray-100">
            <i className="ri-arrow-left-line text-xl text-gray-700"></i>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">영수증 상세</h1>
          <button className="w-10 h-10 flex items-center justify-center !rounded-button hover:bg-gray-100">
            <i className="ri-share-line text-xl text-gray-700"></i>
          </button>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* 언어 전환 토글 */}
        <div className="mb-6">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button
              onClick={() => setShowOriginal(false)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors !rounded-button ${
                !showOriginal
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              한국어
            </button>
            <button
              onClick={() => setShowOriginal(true)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors !rounded-button ${
                showOriginal
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              日本語
            </button>
          </div>
        </div>

        {/* 영수증 카드 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* 매장 정보 */}
          <div className="text-center p-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {showOriginal ? receipt.store : receipt.storeKr}
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>TEL: {receipt.tel}</p>
              <p>{showOriginal ? receipt.address : receipt.addressKr}</p>
            </div>
          </div>

          {/* 거래 정보 */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex justify-between text-sm">
              <div className="space-y-1">
                <div className="flex gap-4">
                  <span className="text-gray-600">날짜:</span>
                  <span className="font-medium">{receipt.date}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600">시간:</span>
                  <span className="font-medium">{receipt.time}</span>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <div className="flex gap-4">
                  <span className="text-gray-600">영수증:</span>
                  <span className="font-medium">No.{receipt.receiptNo}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600">계산대:</span>
                  <span className="font-medium">{receipt.cashierNo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 상품 목록 */}
          <div className="px-6 py-4">
            <h3 className="font-semibold text-gray-900 mb-4">구매 상품</h3>
            <div className="space-y-4">
              {receipt.items.map((item, index) => (
                <div key={index} className="border-b border-gray-50 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {showOriginal ? item.name : item.nameKr}
                      </h4>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>상품코드: {item.code}</div>
                        <div className="flex items-center gap-2">
                          <span>수량: {item.quantity}개</span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                            {item.tax}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="font-semibold text-gray-900">
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-600">
                        ₩{(item.priceKr * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 합계 정보 */}
          <div className="px-6 py-4 bg-gray-50 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">소계</span>
              <div className="text-right">
                <div>¥{receipt.subtotal.toLocaleString()}</div>
                <div className="text-blue-600">₩{receipt.subtotalKr.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">세금</span>
              <div className="text-right">
                <div>¥{receipt.tax.toLocaleString()}</div>
                <div className="text-blue-600">₩{receipt.taxKr.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
              <span>합계</span>
              <div className="text-right">
                <div>¥{receipt.total.toLocaleString()}</div>
                <div className="text-blue-600">₩{receipt.totalKr.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">결제방법</span>
                <span className="font-medium">
                  {showOriginal ? receipt.paymentMethod : receipt.paymentMethodKr}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">받은금액</span>
                <div className="text-right">
                  <div>¥{(receipt.total + receipt.change).toLocaleString()}</div>
                  <div className="text-blue-600">₩{(receipt.totalKr + receipt.changeKr).toLocaleString()}</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">거스름돈</span>
                <div className="text-right">
                  <div>¥{receipt.change.toLocaleString()}</div>
                  <div className="text-blue-600">₩{receipt.changeKr.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 환율 정보 */}
          <div className="px-6 py-4 bg-blue-50 text-center">
            <div className="text-xs text-blue-800">
              환율 기준: ¥1 = ₩{receipt.exchangeRate} ({receipt.date} 적용)
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className="bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors !rounded-button">
            <i className="ri-edit-line mr-2"></i>
            수정하기
          </button>
          <button className="bg-red-50 border border-red-200 text-red-600 py-3 px-4 rounded-xl font-medium hover:bg-red-100 transition-colors !rounded-button">
            <i className="ri-delete-bin-line mr-2"></i>
            삭제하기
          </button>
        </div>

        {/* 카테고리 및 태그 */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">분류 정보</h3>
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-600 mb-2 block">카테고리</span>
              <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <i className="ri-shopping-bag-line mr-2"></i>
                쇼핑
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-600 mb-2 block">매장 유형</span>
              <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                <i className="ri-store-line mr-2"></i>
                편의점/잡화점
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-600 mb-2 block">상품 유형</span>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">과자</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">음료</span>
                <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs">간식</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}