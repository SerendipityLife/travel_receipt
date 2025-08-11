
'use client';

import { useState } from 'react';
import Link from 'next/link';
import CameraScanner from './CameraScanner';
import ReceiptPreview from './ReceiptPreview';

export default function ReceiptScanner() {
  const [scannedReceipt, setScannedReceipt] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/" className="w-10 h-10 flex items-center justify-center !rounded-button hover:bg-gray-100">
            <i className="ri-arrow-left-line text-xl text-gray-700"></i>
          </Link>
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
          />
        )}
      </div>
    </div>
  );
}
