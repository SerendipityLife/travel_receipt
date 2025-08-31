'use client';

import Link from 'next/link';
import { useState } from 'react';
import { receiptStorage, reviewStorage, session } from '../utils/mockData';
import ReviewModal from './ReviewModal';

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
  currentTripIndex?: number;
}

export default function RecentReceipts({ receipts, onAddReceipt, currentTripIndex = 0 }: RecentReceiptsProps) {
  const [preview, setPreview] = useState<any | null>(null);
  const [reviewTarget, setReviewTarget] = useState<{
    productName: string;
    productCode?: string;
    receiptId?: string;
    tripId?: string;
    existingReviewId?: string;
    initialRating?: number;
    initialText?: string;
    remainingEdits?: number;
  } | null>(null);

  const openPreview = (id: number) => {
    const found = receiptStorage.getById(String(id));
    if (found) {
      setPreview(found);
    } else {
      // 샘플 아이템 (스토리지에 없을 때 표시)
      setPreview({
        _id: String(id),
        storeKr: '샘플 매장',
        date: '2024-11-16',
        time: '12:34:56',
        items: [
          { code: 'S-1001', nameKr: '샘플 과자', priceKr: 1500, quantity: 2, tax: '포함' },
          { code: 'S-2001', nameKr: '샘플 음료', priceKr: 1200, quantity: 1, tax: '포함' },
        ],
        totalKr: 4200,
      });
    }
  };

  const closePreview = () => setPreview(null);
  const openReview = (item: any) => {
    const productName = item.nameKr || item.name;
    const productCode = item.code;
    const currentUserId = session.getCurrentUserId();
    const existing = reviewStorage.getByUserAndProduct(
      currentUserId,
      productCode,
      productName,
      preview?.tripId
    );
    const remainingEdits = existing ? Math.max(0, 2 - (existing.editCount ?? 0)) : 2;
    setReviewTarget({
      productName,
      productCode,
      receiptId: preview?._id,
      tripId: preview?.tripId,
      existingReviewId: existing?.id,
      initialRating: existing?.rating,
      initialText: existing?.text,
      remainingEdits,
    });
  };
  const closeReview = () => setReviewTarget(null);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">최근 영수증</h3>
        <Link 
          href={`/receipt-scanner?tripIndex=${currentTripIndex}`}
          className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors !rounded-button"
        >
          <i className="ri-add-line text-blue-600 text-lg"></i>
        </Link>
      </div>

      {receipts.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {receipts.slice(0, 7).map((receipt) => (
            <div key={receipt.id}>
              <div
                onClick={() => openPreview(receipt.id)}
                className="flex items-center gap-3 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-base leading-tight truncate mr-3">{receipt.store}</h4>
                    <span className="text-base font-bold text-gray-900 leading-tight flex-shrink-0">₩{receipt.amount.toLocaleString()}</span>
                  </div>
                
                  <div className="flex items-center gap-4 text-xs text-gray-600 whitespace-nowrap">
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
                </div>
                
                {/* 상세 버튼 (우측) */}
                <div className="flex-shrink-0">
                  <Link
                    href={`/receipt/${receipt.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm !rounded-button"
                    aria-label="상세보기"
                    title="상세보기"
                  >
                    <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
              </div>
              
            </div>
          ))}
          
          {receipts.length > 7 && (
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
            href={`/receipt-scanner?tripIndex=${currentTripIndex}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors !rounded-button"
          >
            <i className="ri-camera-line text-xl"></i>
            영수증 스캔
          </Link>
        </div>
      )}

      {/* 미니 미리보기 모달 */}
      {preview && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-gray-900">구매 항목 미리보기</h4>
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100" onClick={closePreview}>
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              {preview.storeKr || '매장'} · {preview.date} {preview.time}
            </div>
            <div className="max-h-72 overflow-auto divide-y divide-gray-100">
              {preview.items?.map((it: any, idx: number) => (
                <div key={idx} className="py-2 flex items-start justify-between gap-3">
                  <div className="mr-3 flex-1">
                    <div className="font-medium text-gray-900">{it.nameKr || it.name}</div>
                    <div className="text-xs text-gray-500">코드 {it.code} · 수량 {it.quantity}</div>
                  </div>
                  <div className="text-right text-sm font-semibold text-gray-900 whitespace-nowrap">₩{(it.priceKr * it.quantity).toLocaleString()}</div>
                  <button
                    className="ml-2 px-2 py-1 rounded-lg border text-xs"
                    onClick={() => openReview(it)}
                  >
                    리뷰
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closePreview} className="px-3 py-2 rounded-lg border">닫기</button>
              <Link href={`/receipt/${preview._id}`} className="px-3 py-2 rounded-lg bg-blue-600 text-white">상세보기</Link>
            </div>
          </div>
        </div>
      )}

      {/* 리뷰 작성 모달 */}
      {reviewTarget && (
        <ReviewModal
          isOpen={true}
          onClose={closeReview}
          title={`${reviewTarget.productName} 리뷰`}
          initialRating={reviewTarget.initialRating}
          initialText={reviewTarget.initialText}
          mode={reviewTarget.existingReviewId ? 'edit' : 'create'}
          remainingEdits={reviewTarget.remainingEdits}
          onSubmit={(rating, text) => {
            try {
              if (reviewTarget.existingReviewId) {
                const currentUserId = session.getCurrentUserId();
                reviewStorage.update(currentUserId, reviewTarget.existingReviewId, { rating, text });
              } else {
                const currentUserId = session.getCurrentUserId();
                reviewStorage.create({
                  userId: currentUserId,
                  productName: reviewTarget.productName,
                  productCode: reviewTarget.productCode,
                  rating,
                  text,
                  receiptId: reviewTarget.receiptId,
                  tripId: reviewTarget.tripId,
                });
              }
            } catch (e: any) {
              alert(e?.message || '리뷰 저장 중 오류가 발생했습니다.');
              return;
            }
            closeReview();
          }}
        />
      )}
    </div>
  );
}