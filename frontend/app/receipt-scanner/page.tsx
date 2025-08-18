
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CameraScanner from './CameraScanner';
import ReceiptPreview from './ReceiptPreview';
import { receiptStorage } from '../utils/mockData';

export default function ReceiptScanner() {
  const [scannedReceipt, setScannedReceipt] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripIndex = searchParams.get('tripIndex');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => {
              if (tripIndex) {
                router.push(`/?tripIndex=${tripIndex}`);
              } else {
                router.push('/');
              }
            }}
            className="w-10 h-10 flex items-center justify-center !rounded-button hover:bg-gray-100"
          >
            <i className="ri-arrow-left-line text-xl text-gray-700"></i>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">영수증 스캐너</h1>
          <div className="w-10 h-10"></div>
        </div>
      </div>

      <div className="px-4 py-6">
        {!scannedReceipt ? (
          <CameraScanner 
            onCapture={setScannedReceipt}
            isScanning={isScanning}
            setIsScanning={setIsScanning}
          />
        ) : (
          <ReceiptPreview 
            receipt={scannedReceipt}
            onEdit={() => setScannedReceipt(null)}
            onSave={() => {
              try {
                // 저장용 Receipt 생성 (mock)
                const created = receiptStorage.create({
                  userId: 'user1',
                  tripId: 'trip1',
                  store: scannedReceipt.store,
                  storeKr: scannedReceipt.store,
                  date: scannedReceipt.date,
                  time: scannedReceipt.time,
                  items: (scannedReceipt.items || []).map((it: any) => ({
                    code: it.code || '',
                    name: it.name || '',
                    nameKr: it.nameKr || '',
                    price: it.price,
                    priceKr: Math.round(it.price * scannedReceipt.exchangeRate),
                    quantity: it.quantity,
                    tax: '내역'
                  })),
                  subtotal: scannedReceipt.total,
                  subtotalKr: scannedReceipt.totalKrw,
                  tax: 0,
                  taxKr: 0,
                  total: scannedReceipt.total,
                  totalKr: scannedReceipt.totalKrw,
                  totalAmount: scannedReceipt.totalKrw,
                  exchangeRate: scannedReceipt.exchangeRate,
                  paymentMethod: '현금',
                  paymentMethodKr: '현금',
                  change: 0,
                  changeKr: 0,
                  category: '기타',
                } as any);

                // 홈으로 이동하며 현재 여행 인덱스 유지
                if (tripIndex) {
                  router.push(`/?tripIndex=${tripIndex}`);
                } else {
                  router.push('/');
                }
              } catch (e) {
                console.error('영수증 저장 실패:', e);
                alert('영수증 저장 중 오류가 발생했습니다.');
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
