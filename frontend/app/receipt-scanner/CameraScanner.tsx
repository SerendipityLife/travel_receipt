
'use client';

import { useState } from 'react';

interface CameraScannerProps {
  onCapture: (receipt: any) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
}

export default function CameraScanner({ onCapture, isScanning, setIsScanning }: CameraScannerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [testFileName, setTestFileName] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowModeSelect(true);
    }
  };

  const handleButtonClick = () => {
    setShowModeSelect(true);
  };

  const handleRealApiCall = async () => {
    setShowModeSelect(false);

    // 파일 선택 다이얼로그 열기
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        return;
      }

      setSelectedFile(file);
      setIsScanning(true);

      try {
        // FormData 생성
        const formData = new FormData();
        formData.append('image', file);

        // OCR API 호출
        const response = await fetch('http://localhost:5001/api/firestore/ocr/analyze', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`OCR API 호출 실패: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          const ocrData = result.data;
          onCapture({
            store: ocrData.storeName,
            date: ocrData.date,
            time: ocrData.time,
            items: ocrData.items.map((item: any) => ({
              name: item.name,
              nameKr: item.name, // 한국어 번역은 별도 처리 필요
              price: item.price,
              quantity: item.quantity
            })),
            total: ocrData.total,
            totalKrw: ocrData.totalKr,
            exchangeRate: ocrData.exchangeRate
          });
        } else {
          throw new Error('OCR 분석 실패');
        }
      } catch (error) {
        console.error('OCR 처리 실패:', error);
        alert('영수증 분석에 실패했습니다. 다시 시도해주세요.');
        setIsScanning(false);
      }
    };
    input.click();
  };

  const handleTestFileCall = async () => {
    if (!testFileName.trim()) {
      alert('파일명을 입력해주세요.');
      return;
    }

    setIsScanning(true);
    setShowModeSelect(false);

    try {
      // 테스트 파일 API 호출
      const response = await fetch('http://localhost:5001/api/firestore/ocr/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: testFileName.trim() }),
      });

      if (!response.ok) {
        throw new Error(`테스트 파일 API 호출 실패: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        const ocrData = result.data;
        onCapture({
          store: ocrData.storeName,
          date: ocrData.date,
          time: ocrData.time,
          items: ocrData.items.map((item: any) => ({
            name: item.name,
            nameKr: item.name,
            price: item.price,
            quantity: item.quantity,
            janCode: item.janCode
          })),
          total: ocrData.total,
          totalKrw: ocrData.totalKr,
          exchangeRate: ocrData.exchangeRate
        });
      } else {
        throw new Error('테스트 파일 분석 실패');
      }
    } catch (error) {
      console.error('테스트 파일 처리 실패:', error);
      alert('테스트 파일 분석에 실패했습니다. 파일명을 확인해주세요.');
      setIsScanning(false);
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

  if (showModeSelect) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-settings-3-line text-3xl text-blue-600"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">처리 모드 선택</h2>
          <p className="text-gray-600 mb-6">이미지를 어떻게 처리하시겠습니까?</p>

          <div className="space-y-4">
            <button
              onClick={handleRealApiCall}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-button hover:bg-blue-700 transition-colors"
            >
              <i className="ri-cloud-line mr-2"></i>
              실제 OCR API 사용 (유료)
            </button>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3">테스트 모드 (무료)</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testFileName}
                  onChange={(e) => setTestFileName(e.target.value)}
                  placeholder="파일명 입력 (예: 21)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleTestFileCall}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  테스트
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                예: 21 → /logs/21.json 파일 사용
              </p>
            </div>

            <button
              onClick={() => {
                setShowModeSelect(false);
                setSelectedFile(null);
                setTestFileName('');
              }}
              className="w-full border-2 border-gray-300 text-gray-700 py-2 px-6 rounded-button hover:border-gray-400 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
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
          <button
            onClick={handleButtonClick}
            className="w-full bg-blue-600 text-white py-3 px-6 !rounded-button cursor-pointer hover:bg-blue-700 transition-colors"
          >
            <i className="ri-camera-line mr-2"></i>
            사진 촬영
          </button>

          <button
            onClick={handleButtonClick}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 !rounded-button cursor-pointer hover:border-gray-400 transition-colors"
          >
            <i className="ri-image-line mr-2"></i>
            이미지 업로드
          </button>
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
