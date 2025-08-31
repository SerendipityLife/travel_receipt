
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BottomNavigationProps {
  onAddTrip?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function BottomNavigation({ onAddTrip, activeTab = 'home', onTabChange }: BottomNavigationProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const router = useRouter();

  const navItems = [
    { id: 'home', icon: 'ri-home-line', label: '홈' },
    { id: 'history', icon: 'ri-time-line', label: '히스토리' },
    { id: 'add', icon: 'ri-add-line', label: '' },
    { id: 'ranking', icon: 'ri-trophy-line', label: '랭킹' },
    { id: 'settings', icon: 'ri-settings-3-line', label: '설정' }
  ];

  const handleAddClick = () => {
    setShowAddMenu(!showAddMenu);
  };

  const handleAddTrip = () => {
    setShowAddMenu(false);
    if (onAddTrip) {
      onAddTrip();
    }
  };

  const handleAddReceipt = () => {
    setShowAddMenu(false);
    router.push('/receipt-scanner');
  };

  const handleNavClick = (itemId: string) => {
    // 페이지 라우팅으로 변경
    if (itemId === 'ranking') {
      router.push('/ranking');
    } else if (itemId === 'settings') {
      router.push('/settings');
    } else if (itemId === 'home') {
      router.push('/');
    } else if (itemId === 'history') {
      router.push('/receipts');
    }
    
    // onTabChange는 홈 페이지 내부 탭용으로만 사용
    if (onTabChange && itemId === 'ranking') {
      onTabChange(itemId);
    }
  };

  return (
    <>
      {/* 팝업 메뉴 */}
      {showAddMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowAddMenu(false)}
          />
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 min-w-48">
              <button
                onClick={handleAddTrip}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-suitcase-line text-lg text-blue-600"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 whitespace-nowrap">일정 추가</div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">새로운 여행 계획</div>
                </div>
              </button>
              
              <button
                onClick={handleAddReceipt}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-camera-line text-lg text-green-600"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 whitespace-nowrap">영수증 추가</div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">사진으로 기록</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  setShowAddMenu(false);
                  router.push('/join');
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="ri-user-add-line text-lg text-purple-600"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 whitespace-nowrap">여행 참여</div>
                  <div className="text-sm text-gray-500 whitespace-nowrap">초대코드로 참여</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-5 h-20">
          {navItems.map((item, index) => {
            if (item.id === 'add') {
              return (
                <div key={item.id} className="flex items-center justify-center">
                  <button 
                    onClick={handleAddClick}
                    className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center -mt-2 !rounded-button ${
                      showAddMenu 
                        ? 'bg-blue-700 text-white' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <i className={`ri-add-line text-2xl transition-transform ${
                      showAddMenu ? 'rotate-45' : ''
                    }`}></i>
                  </button>
                </div>
              );
            }
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                  activeTab === item.id
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center mb-1">
                  <i className={`${item.icon} text-xl`}></i>
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
