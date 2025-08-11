'use client';

import { useState } from 'react';

export default function AppearanceSettings() {
  const [darkMode, setDarkMode] = useState(false);
  const [colorTheme, setColorTheme] = useState('blue');
  const [fontSize, setFontSize] = useState('medium');

  const colorThemes = [
    { id: 'blue', name: '블루', color: 'bg-blue-500', accent: 'bg-blue-100' },
    { id: 'purple', name: '퍼플', color: 'bg-purple-500', accent: 'bg-purple-100' },
    { id: 'green', name: '그린', color: 'bg-green-500', accent: 'bg-green-100' },
    { id: 'pink', name: '핑크', color: 'bg-pink-500', accent: 'bg-pink-100' },
    { id: 'orange', name: '오렌지', color: 'bg-orange-500', accent: 'bg-orange-100' }
  ];

  const fontSizes = [
    { id: 'small', name: '작게', size: 'text-sm' },
    { id: 'medium', name: '보통', size: 'text-base' },
    { id: 'large', name: '크게', size: 'text-lg' }
  ];

  return (
    <div className="space-y-6">
      {/* 다크모드 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <i className="ri-moon-line text-gray-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">다크모드</h3>
            <p className="text-sm text-gray-600">어두운 테마로 눈의 피로를 줄여보세요</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <div className="font-medium text-gray-900">다크모드 사용</div>
            <div className="text-sm text-gray-600 mt-1">밤에 사용하기 편한 어두운 테마</div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              darkMode ? 'bg-gray-700' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 색상 테마 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="ri-palette-line text-blue-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">색상 테마</h3>
            <p className="text-sm text-gray-600">앱의 기본 색상을 변경할 수 있어요</p>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-3">
          {colorThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setColorTheme(theme.id)}
              className={`p-4 rounded-xl border-2 transition-colors ${
                colorTheme === theme.id
                  ? 'border-gray-400 bg-gray-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className={`w-8 h-8 ${theme.color} rounded-full mx-auto mb-2`}></div>
              <div className="text-xs font-medium text-gray-700">{theme.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 글자 크기 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <i className="ri-font-size text-green-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">글자 크기</h3>
            <p className="text-sm text-gray-600">읽기 편한 글자 크기를 선택하세요</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {fontSizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setFontSize(size.id)}
              className={`w-full p-4 rounded-xl border text-left transition-colors !rounded-button ${
                fontSize === size.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className={`font-medium text-gray-900 ${size.size}`}>{size.name}</div>
                  <div className={`text-gray-600 mt-1 ${size.size}`}>예시 텍스트입니다</div>
                </div>
                {fontSize === size.id && (
                  <i className="ri-check-line text-green-500 text-lg"></i>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 레이아웃 설정 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <i className="ri-layout-line text-purple-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">화면 설정</h3>
            <p className="text-sm text-gray-600">화면 표시 방식을 조정할 수 있어요</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700 font-medium">카드형 레이아웃</span>
            <button className="relative w-12 h-6 bg-purple-500 rounded-full">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6"></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700 font-medium">간격 넓게</span>
            <button className="relative w-12 h-6 bg-gray-300 rounded-full">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-0.5"></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700 font-medium">애니메이션 효과</span>
            <button className="relative w-12 h-6 bg-purple-500 rounded-full">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}