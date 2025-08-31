'use client';

import { useState } from 'react';

export default function NotificationSettings() {
  const [budgetAlert, setBudgetAlert] = useState(true);
  const [receiptReminder, setReceiptReminder] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [travelTips, setTravelTips] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const toggleSetting = (setting: string) => {
    switch (setting) {
      case 'budgetAlert':
        setBudgetAlert(!budgetAlert);
        break;
      case 'receiptReminder':
        setReceiptReminder(!receiptReminder);
        break;
      case 'dailySummary':
        setDailySummary(!dailySummary);
        break;
      case 'travelTips':
        setTravelTips(!travelTips);
        break;
      case 'promotions':
        setPromotions(!promotions);
        break;
    }
  };

  const NotificationToggle = ({ 
    enabled, 
    onToggle, 
    title, 
    description 
  }: { 
    enabled: boolean; 
    onToggle: () => void; 
    title: string; 
    description: string; 
  }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? 'bg-blue-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 여행 관련 알림 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="ri-notification-3-line text-blue-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">여행 알림</h3>
            <p className="text-sm text-gray-600">여행 중 중요한 알림을 받아보세요</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <NotificationToggle
            enabled={budgetAlert}
            onToggle={() => toggleSetting('budgetAlert')}
            title="예산 초과 알림"
            description="설정한 예산을 초과할 때 알려드려요"
          />
          
          <NotificationToggle
            enabled={receiptReminder}
            onToggle={() => toggleSetting('receiptReminder')}
            title="영수증 추가 리마인더"
            description="하루 끝에 영수증 추가를 잊지 않도록 알려드려요"
          />
          
          <NotificationToggle
            enabled={dailySummary}
            onToggle={() => toggleSetting('dailySummary')}
            title="일일 지출 요약"
            description="매일 저녁 하루 지출 내역을 요약해드려요"
          />
        </div>
      </div>

      {/* 일반 알림 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <i className="ri-information-line text-green-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">일반 알림</h3>
            <p className="text-sm text-gray-600">앱 업데이트와 유용한 정보를 받아보세요</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <NotificationToggle
            enabled={travelTips}
            onToggle={() => toggleSetting('travelTips')}
            title="여행 팁 & 정보"
            description="여행지별 유용한 팁과 정보를 알려드려요"
          />
          
          <NotificationToggle
            enabled={promotions}
            onToggle={() => toggleSetting('promotions')}
            title="혜택 & 이벤트"
            description="할인 혜택과 특별 이벤트 소식을 받아보세요"
          />
        </div>
      </div>

      {/* 알림 시간 설정 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <i className="ri-time-line text-purple-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">알림 시간</h3>
            <p className="text-sm text-gray-600">알림을 받을 시간을 설정하세요</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">방해 금지 시간</span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>22:00</span>
              <span>~</span>
              <span>08:00</span>
              <button className="ml-2 text-blue-500 hover:text-blue-600">
                <i className="ri-edit-line"></i>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">리마인더 시간</span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>20:00</span>
              <button className="ml-2 text-blue-500 hover:text-blue-600">
                <i className="ri-edit-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}