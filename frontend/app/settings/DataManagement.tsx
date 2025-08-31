'use client';

import { useState } from 'react';

export default function DataManagement() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleExportData = async (format: 'excel' | 'pdf') => {
    setIsExporting(true);
    // 실제로는 API 호출
    setTimeout(() => {
      setIsExporting(false);
      alert(`${format.toUpperCase()} 파일로 내보내기가 완료되었습니다.`);
    }, 2000);
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    // 실제로는 클라우드 백업 API 호출
    setTimeout(() => {
      setIsBackingUp(false);
      alert('데이터 백업이 완료되었습니다.');
    }, 3000);
  };

  const handleDeleteAllData = () => {
    setShowDeleteConfirm(false);
    // 실제로는 데이터 삭제 API 호출
    alert('모든 데이터가 삭제되었습니다.');
  };

  const dataStats = [
    { label: '전체 여행', value: '12건', icon: 'ri-suitcase-line', color: 'bg-blue-100 text-blue-600' },
    { label: '총 영수증', value: '156장', icon: 'ri-receipt-line', color: 'bg-green-100 text-green-600' },
    { label: '데이터 용량', value: '24.5MB', icon: 'ri-database-line', color: 'bg-purple-100 text-purple-600' },
    { label: '마지막 백업', value: '2024-11-10', icon: 'ri-cloud-line', color: 'bg-orange-100 text-orange-600' }
  ];

  return (
    <div className="space-y-6">
      {/* 데이터 현황 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="ri-pie-chart-line text-blue-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">데이터 현황</h3>
            <p className="text-sm text-gray-600">현재 저장된 데이터 정보입니다</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {dataStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.color}`}>
                  <i className={`${stat.icon} text-sm`}></i>
                </div>
                <div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  <div className="font-bold text-gray-900">{stat.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 데이터 내보내기 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <i className="ri-download-line text-green-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">데이터 내보내기</h3>
            <p className="text-sm text-gray-600">여행 기록을 다양한 형식으로 저장하세요</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => handleExportData('excel')}
            disabled={isExporting}
            className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left !rounded-button disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-file-excel-line text-green-600 text-lg"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Excel 파일로 내보내기</div>
                  <div className="text-sm text-gray-600">표 형태로 정리된 데이터</div>
                </div>
              </div>
              {isExporting ? (
                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <i className="ri-arrow-right-line text-green-600"></i>
              )}
            </div>
          </button>

          <button
            onClick={() => handleExportData('pdf')}
            disabled={isExporting}
            className="w-full p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-left !rounded-button disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="ri-file-pdf-line text-red-600 text-lg"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900">PDF 보고서로 내보내기</div>
                  <div className="text-sm text-gray-600">이쁘게 정리된 여행 보고서</div>
                </div>
              </div>
              {isExporting ? (
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <i className="ri-arrow-right-line text-red-600"></i>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* 데이터 백업 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <i className="ri-cloud-line text-purple-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">클라우드 백업</h3>
            <p className="text-sm text-gray-600">데이터를 안전하게 백업하고 복원하세요</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium text-gray-900">자동 백업</div>
                <div className="text-sm text-gray-600">매일 자정에 자동으로 백업됩니다</div>
              </div>
              <button className="relative w-12 h-6 bg-purple-500 rounded-full">
                <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6"></div>
              </button>
            </div>
          </div>

          <button
            onClick={handleBackup}
            disabled={isBackingUp}
            className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left !rounded-button disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">지금 백업하기</div>
                <div className="text-sm text-gray-600">현재 데이터를 즉시 백업합니다</div>
              </div>
              {isBackingUp ? (
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <i className="ri-upload-cloud-line text-purple-600 text-xl"></i>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* 데이터 초기화 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <i className="ri-delete-bin-line text-red-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-red-700">위험 구역</h3>
            <p className="text-sm text-gray-600">신중하게 사용해주세요</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full p-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors text-left !rounded-button"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-red-700">모든 데이터 삭제</div>
              <div className="text-sm text-gray-600">모든 여행 기록이 영구적으로 삭제됩니다</div>
            </div>
            <i className="ri-arrow-right-line text-red-600"></i>
          </div>
        </button>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-80 max-w-[90vw]">
            <div className="bg-white rounded-2xl p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-error-warning-line text-2xl text-red-600"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">정말 삭제하시겠습니까?</h3>
                <p className="text-sm text-gray-600">
                  모든 여행 기록과 영수증이 영구적으로 삭제됩니다.<br/>
                  이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors !rounded-button"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteAllData}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors !rounded-button"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}