'use client';

import { useState, useEffect } from 'react';
import MemberEditModal from './MemberEditModal';

interface TripMember {
  id: string;
  name: string;
  permission: 'editor' | 'viewer';
  joinedAt: string;
  inviteCode: string;
}

interface TripInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  tripId: string;
  currentMembers: TripMember[];
  isCreator: boolean; // 여행 생성자인지 여부
  onGenerateInviteCode?: (tripId: string) => Promise<string>;
  onRemoveMember?: (tripId: string, memberId: string) => void;
  onUpdateMemberPermission?: (tripId: string, memberId: string, permission: 'editor' | 'viewer') => void;
  onUpdateMemberInfo?: (tripId: string, memberId: string, name: string, permission: 'editor' | 'viewer') => void;
}

export default function TripInviteModal({
  isOpen,
  onClose,
  tripTitle,
  tripId,
  currentMembers,
  isCreator,
  onGenerateInviteCode,
  onRemoveMember,
  onUpdateMemberPermission,
  onUpdateMemberInfo
}: TripInviteModalProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TripMember | null>(null);

  const handleGenerateInviteCode = async () => {
    if (!onGenerateInviteCode) return;
    
    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      const newInviteCode = await onGenerateInviteCode(tripId);
      setInviteCode(newInviteCode);
      setSuccess('새로운 초대코드가 생성되었습니다!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('초대코드 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyInviteCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setSuccess('초대코드가 복사되었습니다!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const getPermissionText = (permission: string) => {
    switch (permission) {
      case 'editor':
        return '편집자';
      case 'viewer':
        return '뷰어';
      default:
        return '알 수 없음';
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditMember = (member: TripMember) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleUpdateMember = (memberId: string, name: string, permission: 'editor' | 'viewer') => {
    // 이름과 권한을 모두 업데이트
    if (onUpdateMemberInfo) {
      onUpdateMemberInfo(tripId, memberId, name, permission);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    if (onRemoveMember) {
      onRemoveMember(tripId, memberId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">동행자 초대</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <i className="ri-close-line text-gray-600"></i>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm text-gray-600">여행: <span className="font-medium text-gray-900">{tripTitle}</span></p>
            {isCreator ? (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                생성자
              </span>
            ) : (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                동행자
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {isCreator 
              ? '초대코드를 통해 동행자들을 여행에 초대할 수 있습니다.' 
              : '현재 여행에 참여 중입니다.'
            }
          </p>
        </div>

        {isCreator ? (
          // 여행 생성자 화면
          <>
            {/* 초대코드 생성 및 관리 */}
            <div className="mb-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">초대코드 생성</h4>
                <div className="space-y-3">
                  {inviteCode && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">현재 초대코드</span>
                        <button
                          onClick={copyInviteCode}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          복사
                        </button>
                      </div>
                      <div className="font-mono text-lg font-bold text-blue-900 bg-white px-3 py-2 rounded border">
                        {inviteCode}
                      </div>
                      <p className="text-xs text-blue-600 mt-2">
                        이 코드를 동행자에게 공유하면 여행에 참여할 수 있습니다.
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={handleGenerateInviteCode}
                    disabled={isGenerating}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGenerating ? '생성중...' : inviteCode ? '새로운 초대코드 생성' : '초대코드 생성'}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              {success && (
                <p className="text-green-500 text-sm">{success}</p>
              )}
            </div>


          </>
        ) : (
          // 동행자 화면 - 빈 화면으로 변경
          <div className="text-center py-8 text-gray-500">
            <i className="ri-user-line text-3xl mb-2"></i>
            <p className="text-sm">동행자 관리 기능은 여행 생성자만 사용할 수 있습니다.</p>
          </div>
        )}


      </div>

      {/* 멤버 정보 수정 모달 */}
      {selectedMember && (
        <MemberEditModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMember(null);
          }}
          member={selectedMember}
          onUpdateMember={handleUpdateMember}
          onDeleteMember={handleDeleteMember}
        />
      )}
    </div>
  );
}
