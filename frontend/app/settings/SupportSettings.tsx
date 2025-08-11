'use client';

import { useState } from 'react';

export default function SupportSettings() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactType, setContactType] = useState('');
  const [message, setMessage] = useState('');

  const supportItems = [
    {
      title: '문의하기',
      description: '궁금한 점이나 문제를 직접 문의하세요',
      icon: 'ri-customer-service-2-line',
      color: 'bg-blue-100 text-blue-600',
      action: () => setShowContactForm(true)
    },
    {
      title: 'FAQ',
      description: '자주 묻는 질문과 답변을 확인하세요',
      icon: 'ri-question-answer-line',
      color: 'bg-green-100 text-green-600',
      action: () => console.log('FAQ 페이지로 이동')
    },
    {
      title: '사용 가이드',
      description: '앱 사용법을 단계별로 알아보세요',
      icon: 'ri-guide-line',
      color: 'bg-purple-100 text-purple-600',
      action: () => console.log('가이드 페이지로 이동')
    },
    {
      title: '업데이트 내역',
      description: '최신 업데이트와 새로운 기능을 확인하세요',
      icon: 'ri-history-line',
      color: 'bg-orange-100 text-orange-600',
      action: () => console.log('업데이트 내역 확인')
    }
  ];

  const appInfo = [
    { label: '앱 버전', value: '1.2.4' },
    { label: '빌드', value: '2024.11.16' },
    { label: '운영체제', value: 'iOS 17.1' },
    { label: '기기', value: 'iPhone 15 Pro' }
  ];

  const legalItems = [
    { title: '개인정보 처리방침', icon: 'ri-shield-user-line' },
    { title: '서비스 이용약관', icon: 'ri-file-text-line' },
    { title: '오픈소스 라이선스', icon: 'ri-code-s-slash-line' },
    { title: '저작권 정보', icon: 'ri-copyright-line' }
  ];

  const contactTypes = [
    '기능 문의',
    '버그 신고',
    '개선 제안',
    '기타 문의'
  ];

  const handleSubmitContact = () => {
    if (!contactType || !message.trim()) {
      alert('문의 유형과 내용을 모두 입력해주세요.');
      return;
    }
    
    // 실제로는 API 호출
    alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
    setShowContactForm(false);
    setContactType('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* 고객 지원 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="ri-customer-service-line text-blue-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">고객 지원</h3>
            <p className="text-sm text-gray-600">도움이 필요하시면 언제든 연락하세요</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {supportItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left !rounded-button"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                    <i className={`${item.icon} text-lg`}></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                </div>
                <i className="ri-arrow-right-line text-gray-600"></i>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 평가 및 피드백 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <i className="ri-star-line text-yellow-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">평가 및 피드백</h3>
            <p className="text-sm text-gray-600">앱을 평가하고 의견을 들려주세요</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <button className="w-full p-4 bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors text-left !rounded-button">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <i className="ri-star-fill text-yellow-600 text-lg"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900">앱스토어에서 평가하기</div>
                  <div className="text-sm text-gray-600">⭐⭐⭐⭐⭐ 별점 남겨주세요</div>
                </div>
              </div>
              <i className="ri-external-link-line text-yellow-600"></i>
            </div>
          </button>

          <button className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left !rounded-button">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-feedback-line text-green-600 text-lg"></i>
                </div>
                <div>
                  <div className="font-medium text-gray-900">피드백 보내기</div>
                  <div className="text-sm text-gray-600">개선 아이디어를 공유해주세요</div>
                </div>
              </div>
              <i className="ri-arrow-right-line text-green-600"></i>
            </div>
          </button>
        </div>
      </div>

      {/* 앱 정보 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <i className="ri-information-line text-purple-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">앱 정보</h3>
            <p className="text-sm text-gray-600">현재 앱의 상세 정보입니다</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {appInfo.map((info, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">{info.label}</span>
              <span className="text-gray-900">{info.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 법적 고지 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <i className="ri-article-line text-gray-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">법적 고지</h3>
            <p className="text-sm text-gray-600">약관 및 정책을 확인하세요</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {legalItems.map((item, index) => (
            <button
              key={index}
              className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left !rounded-button"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className={`${item.icon} text-gray-600`}></i>
                  <span className="text-gray-900">{item.title}</span>
                </div>
                <i className="ri-arrow-right-line text-gray-600 text-sm"></i>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 문의 양식 모달 */}
      {showContactForm && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowContactForm(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-80 max-w-[90vw]">
            <div className="bg-white rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="ri-mail-line text-xl text-blue-600"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">문의하기</h3>
                <p className="text-sm text-gray-600">궁금한 점을 자세히 적어주세요</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    문의 유형
                  </label>
                  <div className="space-y-2">
                    {contactTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setContactType(type)}
                        className={`w-full p-3 rounded-lg border text-left transition-colors !rounded-button ${
                          contactType === type
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900">{type}</span>
                          {contactType === type && (
                            <i className="ri-check-line text-blue-500"></i>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    문의 내용
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="문의 내용을 자세히 적어주세요..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-3 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {message.length}/500
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors !rounded-button"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitContact}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors !rounded-button"
                >
                  보내기
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}