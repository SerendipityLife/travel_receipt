'use client';

import { useState } from 'react';

interface TripMember {
  id: string;
  name: string;
  permission: 'editor' | 'viewer';
  joinedAt: string;
  inviteCode: string;
}

interface MemberEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TripMember;
  onUpdateMember: (memberId: string, name: string, permission: 'editor' | 'viewer') => void;
  onDeleteMember: (memberId: string) => void;
}

export default function MemberEditModal({
  isOpen,
  onClose,
  member,
  onUpdateMember,
  onDeleteMember
}: MemberEditModalProps) {
  const [name, setName] = useState(member.name);
  const [permission, setPermission] = useState<'editor' | 'viewer'>(member.permission);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    setIsUpdating(true);
    setError('');

    try {
      onUpdateMember(member.id, name.trim(), permission);
      onClose();
    } catch (err) {
      setError('멤버 정보 수정에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 멤버를 제거하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      onDeleteMember(member.id);
      onClose();
    } catch (err) {
      setError('멤버 제거에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setName(member.name);
    setPermission(member.permission);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-edit-line text-2xl text-orange-500"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">멤버 정보 수정</h3>
          <p className="text-sm text-gray-600">멤버의 정보를 수정하세요</p>
        </div>

        {/* 입력 필드 */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="멤버 이름을 입력하세요"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              권한
            </label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as 'editor' | 'viewer')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="viewer">뷰어 (조회만 가능)</option>
              <option value="editor">편집자 (수정 가능)</option>
            </select>
          </div>
        </div>

        {/* 권한 설명 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
          >
            {isDeleting ? '삭제중...' : '삭제'}
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating || !name.trim()}
            className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
          >
            {isUpdating ? '수정중...' : '수정'}
          </button>
        </div>
      </div>
    </div>
  );
}
