'use client';

import { useState } from 'react';

interface InviteCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinTrip: (inviteCode: string, name: string) => Promise<void>;
}

export default function InviteCodeModal({
  isOpen,
  onClose,
  onJoinTrip
}: InviteCodeModalProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [name, setName] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleJoinTrip = async () => {
    if (!inviteCode.trim()) {
      setError('초대코드를 입력해주세요.');
      return;
    }

    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    setIsJoining(true);
    setError('');
    setSuccess('');

    try {
      await onJoinTrip(inviteCode.trim(), name.trim());
      setInviteCode('');
      setName('');
      setSuccess('여행에 성공적으로 참여했습니다!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 2000);
    } catch (err) {
      setError('여행 참여에 실패했습니다. 초대코드를 확인해주세요.');
    } finally {
      setIsJoining(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">여행 참여하기</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <i className="ri-close-line text-gray-600"></i>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">
            초대코드를 입력하여 여행에 참여할 수 있습니다.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              초대코드 *
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="초대코드를 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-center text-lg"
              maxLength={8}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinTrip()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={20}
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <i className="ri-information-line text-blue-500"></i>
              <span className="text-sm font-medium text-blue-900">참여 권한</span>
            </div>
            <p className="text-xs text-blue-700">
              기본적으로 <strong>뷰어</strong> 권한으로 참여합니다. 여행 생성자가 나중에 권한을 변경할 수 있습니다.
            </p>
          </div>

          <button
            onClick={handleJoinTrip}
            disabled={isJoining || !inviteCode.trim() || !name.trim()}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isJoining ? '참여중...' : '여행 참여하기'}
          </button>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-sm">{success}</p>
          )}
        </div>

        {/* 권한 설명 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">권한 설명</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span><strong>편집자:</strong> 여행 정보 수정, 영수증 추가/삭제 가능</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span><strong>뷰어:</strong> 여행 정보 조회만 가능</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
