'use client';

import { useState } from 'react';
import Link from 'next/link';
import BottomNavigation from '../components/BottomNavigation';
import NotificationSettings from './NotificationSettings';
import AppearanceSettings from './AppearanceSettings';
import DataManagement from './DataManagement';
import SecuritySettings from './SecuritySettings';
import SupportSettings from './SupportSettings';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', name: '일반 설정', icon: 'ri-settings-3-line' },
    { id: 'notifications', name: '알림 설정', icon: 'ri-notification-3-line' },
    { id: 'appearance', name: '테마 및 표시', icon: 'ri-palette-line' },
    { id: 'data', name: '데이터 관리', icon: 'ri-database-line' },
    { id: 'security', name: '보안 설정', icon: 'ri-shield-line' },
    { id: 'support', name: '고객 지원', icon: 'ri-customer-service-line' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'notifications':
        return <NotificationSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'data':
        return <DataManagement />;
      case 'security':
        return <SecuritySettings />;
      case 'support':
        return <SupportSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 컨텐츠 */}
      <div className="pt-4 pb-24">
        {/* 프로필 섹션 */}
        <div className="px-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <i className="ri-user-line text-2xl text-white"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">사용자</h3>
                <p className="text-gray-600 text-sm">여행 영수증 관리</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">무료 플랜</span>
                  <span className="text-xs text-blue-600">업그레이드 →</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 설정 섹션 탭 */}
        <div className="px-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors !rounded-button flex items-center gap-2 ${
                  activeSection === section.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <i className={`${section.icon} text-lg`}></i>
                {section.name}
              </button>
            ))}
          </div>
        </div>

        {/* 설정 컨텐츠 */}
        <div className="px-4">
          {renderContent()}
        </div>
      </div>

      <BottomNavigation currentTab="profile" />
    </div>
  );
}

function GeneralSettings() {
  const [language, setLanguage] = useState('ko');
  const [currency, setCurrency] = useState('KRW');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const currencies = [
    { code: 'KRW', name: '한국 원화', symbol: '₩' },
    { code: 'USD', name: '미국 달러', symbol: '$' },
    { code: 'JPY', name: '일본 엔', symbol: '¥' },
    { code: 'EUR', name: '유로', symbol: '€' }
  ];

  const dateFormats = [
    { format: 'YYYY-MM-DD', example: '2024-01-15' },
    { format: 'MM/DD/YYYY', example: '01/15/2024' },
    { format: 'DD/MM/YYYY', example: '15/01/2024' },
    { format: 'YYYY년 MM월 DD일', example: '2024년 01월 15일' }
  ];

  return (
    <div className="space-y-6">
      {/* 언어 설정 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="ri-global-line text-blue-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">언어 설정</h3>
            <p className="text-sm text-gray-600">앱에서 사용할 언어를 선택하세요</p>
          </div>
        </div>

        <div className="space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full p-3 rounded-xl border text-left transition-colors !rounded-button ${
                language === lang.code
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-medium text-gray-900">{lang.name}</span>
                </div>
                {language === lang.code && (
                  <i className="ri-check-line text-blue-500 text-lg"></i>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 통화 설정 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <i className="ri-money-dollar-circle-line text-green-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">기본 통화</h3>
            <p className="text-sm text-gray-600">금액 표시에 사용할 통화를 선택하세요</p>
          </div>
        </div>

        <div className="space-y-2">
          {currencies.map((curr) => (
            <button
              key={curr.code}
              onClick={() => setCurrency(curr.code)}
              className={`w-full p-3 rounded-xl border text-left transition-colors !rounded-button ${
                currency === curr.code
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-600">{curr.symbol}</span>
                  <div>
                    <div className="font-medium text-gray-900">{curr.name}</div>
                    <div className="text-sm text-gray-500">{curr.code}</div>
                  </div>
                </div>
                {currency === curr.code && (
                  <i className="ri-check-line text-green-500 text-lg"></i>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 날짜 형식 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <i className="ri-calendar-line text-purple-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">날짜 형식</h3>
            <p className="text-sm text-gray-600">날짜 표시 방식을 선택하세요</p>
          </div>
        </div>

        <div className="space-y-2">
          {dateFormats.map((format) => (
            <button
              key={format.format}
              onClick={() => setDateFormat(format.format)}
              className={`w-full p-3 rounded-xl border text-left transition-colors !rounded-button ${
                dateFormat === format.format
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{format.format}</div>
                  <div className="text-sm text-gray-500">{format.example}</div>
                </div>
                {dateFormat === format.format && (
                  <i className="ri-check-line text-purple-500 text-lg"></i>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
