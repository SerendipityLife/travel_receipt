'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { receiptStorage } from '../../utils/mockData';

interface ReceiptDetailProps {
  receiptId: string;
}

export default function ReceiptDetail({ receiptId }: ReceiptDetailProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get receipt data from storage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const receiptData = receiptStorage.getById(receiptId);
      setReceipt(receiptData);
      setIsLoading(false);
    }
  }, [receiptId]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">영수증을 찾을 수 없습니다</h1>
          <Link href="/receipts" className="text-blue-600 hover:text-blue-700">
            영수증 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const [showOriginal, setShowOriginal] = useState(false);

  // Delete receipt function
  const handleDeleteReceipt = () => {
    if (!receiptId) return;
    
    setIsDeleting(true);
    try {
      const success = receiptStorage.delete(receiptId);
      if (success) {
        // Redirect to receipts list after successful deletion
        router.push('/receipts');
      } else {
        alert('영수증 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to delete receipt:', error);
      alert('영수증 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Update receipt function
  const handleUpdateReceipt = (updatedData: any) => {
    if (!receiptId) return;
    
    setIsUpdating(true);
    try {
      const success = receiptStorage.update(receiptId, updatedData);
      if (success) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert('영수증 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to update receipt:', error);
      alert('영수증 수정에 실패했습니다.');
    } finally {
      setIsUpdating(false);
      setShowEditModal(false);
    }
  };

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
          <button 
            onClick={() => setShowEditModal(true)}
            disabled={isUpdating}
            className="bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors !rounded-button disabled:opacity-50"
          >
            <i className="ri-edit-line mr-2"></i>
            {isUpdating ? '수정 중...' : '수정하기'}
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="bg-red-50 border border-red-200 text-red-600 py-3 px-4 rounded-xl font-medium hover:bg-red-100 transition-colors !rounded-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="ri-delete-bin-line mr-2"></i>
            {isDeleting ? '삭제 중...' : '삭제하기'}
          </button>
        </div>

        {/* 삭제 확인 모달 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">영수증 삭제</h3>
              <p className="text-gray-600 mb-6">
                이 영수증을 삭제하시겠습니까? 삭제하면 예산에서도 해당 금액이 차감됩니다.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteReceipt}
                  disabled={isDeleting}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? '삭제 중...' : '삭제'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 수정 모달 */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">영수증 수정</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={receipt.category || '쇼핑'}
                  >
                    <option value="음식">음식</option>
                    <option value="교통">교통</option>
                    <option value="쇼핑">쇼핑</option>
                    <option value="숙박">숙박</option>
                    <option value="관광">관광</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">매장 유형</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={receipt.storeType || '편의점/잡화점'}
                  >
                    <option value="편의점/잡화점">편의점/잡화점</option>
                    <option value="음식점">음식점</option>
                    <option value="카페">카페</option>
                    <option value="백화점">백화점</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">상품 유형</label>
                  <div className="space-y-2">
                    {['과자', '음료', '간식', '생활용품', '의류', '전자제품'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2"
                          defaultChecked={receipt.productTypes?.includes(type)}
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={isUpdating}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    // Get form data and update
                    const category = (document.querySelector('select') as HTMLSelectElement)?.value;
                    const storeType = (document.querySelectorAll('select')[1] as HTMLSelectElement)?.value;
                    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
                    const productTypes = Array.from(checkboxes).map(cb => (cb as HTMLInputElement).nextElementSibling?.textContent || '');
                    
                    handleUpdateReceipt({
                      category,
                      storeType,
                      productTypes
                    });
                  }}
                  disabled={isUpdating}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? '수정 중...' : '수정'}
                </button>
              </div>
            </div>
          </div>
        )}

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