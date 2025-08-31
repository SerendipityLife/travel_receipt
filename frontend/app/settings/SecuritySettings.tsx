'use client';

import { useState } from 'react';

export default function SecuritySettings() {
  const [appLock, setAppLock] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [autoLock, setAutoLock] = useState('5min');
  const [showPinModal, setShowPinModal] = useState(false);

  const autoLockOptions = [
    { value: 'immediate', label: '즉시' },
    { value: '1min', label: '1분 후' },
    { value: '5min', label: '5분 후' },
    { value: '15min', label: '15분 후' },
    { value: 'never', label: '사용 안함' }
  ];

  const handleAppLockToggle = () => {
    if (!appLock) {
      setShowPinModal(true);
    } else {
      setAppLock(false);
    }
  };

  const handlePinSetup = (pin: string) => {
    // PIN 설정 로직
    setAppLock(true);
    setShowPinModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 앱 잠금 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <i className="ri-lock-line text-red-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">앱 잠금</h3>
            <p className="text-sm text-gray-600">앱을 열 때 인증이 필요합니다</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="font-medium text-gray-900">앱 잠금 사용</div>
              <div className="text-sm text-gray-600 mt-1">PIN 또는 생체인증으로 보호</div>
            </div>
            <button
              onClick={handleAppLockToggle}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                appLock ? 'bg-red-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                  appLock ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {appLock && (
            <>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900">생체인증</div>
                  <div className="text-sm text-gray-600 mt-1">지문 또는 얼굴인식</div>
                </div>
                <button
                  onClick={() => setBiometric(!biometric)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    biometric ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                      biometric ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="font-medium text-gray-900 mb-3">자동 잠금 시간</div>
                <div className="space-y-2">
                  {autoLockOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAutoLock(option.value)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors !rounded-button ${
                        autoLock === option.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">{option.label}</span>
                        {autoLock === option.value && (
                          <i className="ri-check-line text-red-500"></i>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-xl transition-colors text-left !rounded-button">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-yellow-800">PIN 번호 변경</div>
                    <div className="text-sm text-yellow-700">새로운 PIN으로 변경합니다</div>
                  </div>
                  <i className="ri-arrow-right-line text-yellow-700"></i>
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 개인정보 보호 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="ri-shield-user-line text-blue-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">개인정보 보호</h3>
            <p className="text-sm text-gray-600">데이터 보호 설정을 관리하세요</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="font-medium text-gray-900">데이터 암호화</div>
              <div className="text-sm text-gray-600 mt-1">민감한 정보를 암호화하여 저장</div>
            </div>
            <button className="relative w-12 h-6 bg-blue-500 rounded-full">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6"></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="font-medium text-gray-900">스크린샷 방지</div>
              <div className="text-sm text-gray-600 mt-1">화면 캡처를 방지합니다</div>
            </div>
            <button className="relative w-12 h-6 bg-gray-300 rounded-full">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-0.5"></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div className="font-medium text-gray-900">앱 전환시 블러 처리</div>
              <div className="text-sm text-gray-600 mt-1">멀티태스킹 화면에서 내용 숨김</div>
            </div>
            <button className="relative w-12 h-6 bg-blue-500 rounded-full">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-6"></div>
            </button>
          </div>
        </div>
      </div>

      {/* 계정 보안 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <i className="ri-account-circle-line text-green-600 text-lg"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">계정 보안</h3>
            <p className="text-sm text-gray-600">계정과 관련된 보안 설정입니다</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <button className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left !rounded-button">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">로그인 기록</div>
                <div className="text-sm text-gray-600">최근 로그인 활동을 확인하세요</div>
              </div>
              <i className="ri-arrow-right-line text-gray-600"></i>
            </div>
          </button>

          <button className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left !rounded-button">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">연결된 기기</div>
                <div className="text-sm text-gray-600">현재 3개 기기에서 사용 중</div>
              </div>
              <i className="ri-arrow-right-line text-gray-600"></i>
            </div>
          </button>

          <button className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left !rounded-button">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">비밀번호 변경</div>
                <div className="text-sm text-gray-600">계정 비밀번호를 변경합니다</div>
              </div>
              <i className="ri-arrow-right-line text-gray-600"></i>
            </div>
          </button>
        </div>
      </div>

      {/* PIN 설정 모달 */}
      {showPinModal && (
        <PinSetupModal
          onSave={handlePinSetup}
          onCancel={() => setShowPinModal(false)}
        />
      )}
    </div>
  );
}

function PinSetupModal({ onSave, onCancel }: { onSave: (pin: string) => void; onCancel: () => void }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1);

  const handlePinInput = (num: string) => {
    if (step === 1 && pin.length < 6) {
      setPin(pin + num);
    } else if (step === 2 && confirmPin.length < 6) {
      setConfirmPin(confirmPin + num);
    }
  };

  const handleDelete = () => {
    if (step === 1) {
      setPin(pin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const handleNext = () => {
    if (step === 1 && pin.length === 6) {
      setStep(2);
    } else if (step === 2 && confirmPin.length === 6) {
      if (pin === confirmPin) {
        onSave(pin);
      } else {
        alert('PIN이 일치하지 않습니다.');
        setStep(1);
        setPin('');
        setConfirmPin('');
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onCancel} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-80 max-w-[90vw]">
        <div className="bg-white rounded-2xl p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {step === 1 ? 'PIN 설정' : 'PIN 확인'}
            </h3>
            <p className="text-sm text-gray-600">
              {step === 1 ? '6자리 PIN을 입력해주세요' : 'PIN을 다시 입력해주세요'}
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 ${
                  (step === 1 ? pin.length : confirmPin.length) > i
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((num) => (
              <button
                key={num}
                onClick={() => num !== '*' && num !== '#' && handlePinInput(num.toString())}
                disabled={num === '*' || num === '#'}
                className={`h-12 rounded-xl font-semibold transition-colors !rounded-button ${
                  num === '*' || num === '#'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors !rounded-button"
            >
              삭제
            </button>
            <button
              onClick={step === 1 ? handleNext : handleNext}
              disabled={(step === 1 ? pin.length : confirmPin.length) !== 6}
              className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors !rounded-button"
            >
              {step === 1 ? '다음' : '완료'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}