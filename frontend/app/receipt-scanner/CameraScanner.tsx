
'use client';

import { useState } from 'react';

interface CameraScannerProps {
  onCapture: (receipt: any) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
}

export default function CameraScanner({ onCapture, isScanning, setIsScanning }: CameraScannerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Simulate OCR processing
      setTimeout(() => {
        onCapture({
          store: "돈키호테 시부야점",
          date: "2024-11-16",
          time: "14:32",
          items: [
            { name: "Kit Kat Matcha", nameKr: "킷캣 말차", price: 298, quantity: 2 },
            { name: "Pocky Chocolate", nameKr: "포키 초콜릿", price: 158, quantity: 1 },
            { name: "Ramune Soda", nameKr: "라무네 사이다", price: 120, quantity: 3 }
          ],
          total: 1014,
          totalKrw: 8950,
          exchangeRate: 8.83
        });
      }, 2000);
      setIsScanning(true);
    }
  };

  if (isScanning) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">영수증 처리 중...</h3>
        <p className="text-gray-600 text-center">OCR이 영수증을 분석하고 원화로 환전하고 있습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-camera-3-line text-3xl text-blue-600"></i>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">영수증 스캔</h2>
        <p className="text-gray-600 mb-6">일본 영수증 사진을 촬영하거나 업로드해주세요</p>
        
        <div className="space-y-3">
          <label className="block">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="bg-blue-600 text-white py-3 px-6 !rounded-button cursor-pointer hover:bg-blue-700 transition-colors">
              <i className="ri-camera-line mr-2"></i>
              사진 촬영
            </div>
          </label>
          
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="border-2 border-gray-300 text-gray-700 py-3 px-6 !rounded-button cursor-pointer hover:border-gray-400 transition-colors">
              <i className="ri-image-line mr-2"></i>
              이미지 업로드
            </div>
          </label>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3">지원 기능:</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <i className="ri-check-line text-green-600"></i>
            <span>매장 유형 자동 인식 (돈키호테, 편의점 등)</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-check-line text-green-600"></i>
            <span>실시간 엔화-원화 환율 변환</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-check-line text-green-600"></i>
            <span>일본어-한국어 상품명 번역</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-check-line text-green-600"></i>
            <span>자동 카테고리 분류</span>
          </div>
        </div>
      </div>
    </div>
  );
}
