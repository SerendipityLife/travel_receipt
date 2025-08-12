'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InviteCodeModal from '../components/InviteCodeModal';
import { tripStorage } from '../utils/mockData';

export default function JoinTripPage() {
  const router = useRouter();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleJoinTrip = async (inviteCode: string, name: string, permission: 'editor' | 'viewer') => {
    try {
      // tripStorage를 사용하여 여행 참여
      const newMember = tripStorage.joinTripWithCode(inviteCode, name, permission);
      
      console.log(`여행 참여 성공: ${name}이(가) ${inviteCode}로 참여`);
      
      // 성공 시 홈페이지로 이동
      router.push('/');
    } catch (error) {
      console.error('여행 참여 실패:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-suitcase-line text-3xl text-blue-500"></i>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">여행에 참여하기</h1>
        <p className="text-gray-600 mb-8">
          초대코드를 받으셨나요?<br />
          코드를 입력하여 여행에 참여할 수 있습니다.
        </p>

        <button
          onClick={() => setShowInviteModal(true)}
          className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors mb-6"
        >
          초대코드 입력하기
        </button>

        <div className="text-sm text-gray-500">
          <p>초대코드가 없으신가요?</p>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            홈으로 돌아가기
          </button>
        </div>

        {/* 초대코드 입력 모달 */}
        <InviteCodeModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onJoinTrip={handleJoinTrip}
        />
      </div>
    </div>
  );
}
