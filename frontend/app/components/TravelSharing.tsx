
// Original code with modifications applied

'use client';

import { useState } from 'react';

interface Member {
  id: number;
  name: string;
  avatar: string;
  spent: number;
  paid: number;
  balance: number;
}

interface SharedExpense {
  id: number;
  description: string;
  amount: number;
  paidBy: string;
  participants: string[];
  date: string;
}

interface TravelSharingProps {
  members: Member[];
  sharedExpenses: SharedExpense[];
  onAddMember?: (name: string) => void;
  onDeleteMember?: (memberId: number, balanceTransfer?: { toMemberId: number; amount: number }) => void;
  onSettlement?: (fromId: number, toId: number, amount: number) => void;
}

export default function TravelSharing({
  members = [],
  sharedExpenses = [],
  onAddMember,
  onDeleteMember,
  onSettlement
}: TravelSharingProps) {
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [showSettlement, setShowSettlement] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showEditExpense, setShowEditExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<SharedExpense | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'expenses'>('members');
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    paidBy: '',
    participants: [] as string[]
  });
  const [memberForm, setMemberForm] = useState({
    name: ''
  });
  const [showDeleteExpenseConfirm, setShowDeleteExpenseConfirm] = useState(false);
  const [showBalanceTransferModal, setShowBalanceTransferModal] = useState(false);
  const [balanceTransferAmount, setBalanceTransferAmount] = useState(0);
  const [selectedTransferMember, setSelectedTransferMember] = useState<number | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  const handleAddMember = () => {
    if (newMemberName.trim() && onAddMember) {
      onAddMember(newMemberName.trim());
      setNewMemberName('');
      setShowAddMember(false);
    }
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name
    });
    setShowEditMember(true);
  };

  const handleUpdateMember = () => {
    if (memberForm.name.trim() && editingMember) {
      // 멤버 정보 수정 로직
      console.log('멤버 정보 수정:', {
        id: editingMember.id,
        name: memberForm.name
      });

      // 폼 초기화
      setMemberForm({
        name: ''
      });
      setEditingMember(null);
      setShowEditMember(false);
    }
  };

  const handleDeleteMember = () => {
    if (editingMember) {
      // 정산 금액이 있는지 확인
      if (editingMember.balance !== 0) {
        setMemberToDelete(editingMember);
        setBalanceTransferAmount(Math.abs(editingMember.balance));
        setShowBalanceTransferModal(true);
        setShowDeleteConfirm(false);
      } else {
        // 정산 금액이 없으면 바로 삭제
        if (onDeleteMember) {
          onDeleteMember(editingMember.id);
        }
        setShowDeleteConfirm(false);
        setShowEditMember(false);
        setEditingMember(null);
        setMemberForm({
          name: ''
        });
      }
    }
  };

  const handleBalanceTransfer = () => {
    if (memberToDelete && onDeleteMember) {
      if (selectedTransferMember) {
        // 다른 멤버에게 금액 이전
        onDeleteMember(memberToDelete.id, {
          toMemberId: selectedTransferMember,
          amount: balanceTransferAmount
        });
      } else {
        // 금액 삭제
        onDeleteMember(memberToDelete.id);
      }
      
      // 모달 닫기
      setShowBalanceTransferModal(false);
      setShowEditMember(false);
      setEditingMember(null);
      setMemberToDelete(null);
      setSelectedTransferMember(null);
      setBalanceTransferAmount(0);
      setMemberForm({
        name: ''
      });
    }
  };

  const handleCancelBalanceTransfer = () => {
    setShowBalanceTransferModal(false);
    setMemberToDelete(null);
    setSelectedTransferMember(null);
    setBalanceTransferAmount(0);
  };

  const handleAddExpense = () => {
    if (expenseForm.description.trim() && expenseForm.amount && expenseForm.paidBy && expenseForm.participants.length > 0) {
      // 지출 내역 추가 로직
      console.log('공유 지출 내역 추가:', expenseForm);

      // 폼 초기화
      setExpenseForm({
        description: '',
        amount: '',
        paidBy: '',
        participants: []
      });
      setShowAddExpense(false);
    }
  };

  const handleEditExpense = (expense: SharedExpense) => {
    setEditingExpense(expense);
    setExpenseForm({
      description: expense.description,
      amount: expense.amount.toString(),
      paidBy: expense.paidBy,
      participants: [...expense.participants]
    });
    setShowEditExpense(true);
  };

  const handleUpdateExpense = () => {
    if (expenseForm.description.trim() && expenseForm.amount && expenseForm.paidBy && expenseForm.participants.length > 0 && editingExpense) {
      // 지출 내역 수정 로직
      console.log('공유 지출 내역 수정:', { ...expenseForm, id: editingExpense.id });

      // 폼 초기화
      setExpenseForm({
        description: '',
        amount: '',
        paidBy: '',
        participants: []
      });
      setEditingExpense(null);
      setShowEditExpense(false);
    }
  };

  const handleDeleteExpense = () => {
    if (editingExpense) {
      console.log('지출 내역 삭제:', editingExpense.id);
      // 지출 내역 삭제 로직
      setShowDeleteExpenseConfirm(false);
      setShowEditExpense(false);
      setEditingExpense(null);
      setExpenseForm({
        description: '',
        amount: '',
        paidBy: '',
        participants: []
      });
    }
  };

  const toggleParticipant = (memberName: string) => {
    setExpenseForm(prev => ({
      ...prev,
      participants: prev.participants.includes(memberName)
        ? prev.participants.filter(name => name !== memberName)
        : [...prev.participants, memberName]
    }));
  };

  const totalSharedAmount = sharedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">동행자 공유</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setShowAddMember(true)}
            className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors !rounded-button"
          >
            <i className="ri-user-add-line text-blue-600 text-sm"></i>
          </button>
          <button
            onClick={() => setShowAddExpense(true)}
            className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors !rounded-button"
          >
            <i className="ri-add-line text-green-600 text-sm"></i>
          </button>
        </div>
      </div>

      {/* 탭 선택 */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors !rounded-button ${
            activeTab === 'members'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          멤버 현황
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors !rounded-button ${
            activeTab === 'expenses'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          공유 지출
        </button>
      </div>

      {activeTab === 'members' ? (
        <div>
          {members.length > 0 ? (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleEditMember(member)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{
                        background: `linear-gradient(135deg, ${member.avatar} 0%, ${member.avatar}CC 100%)`
                      }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{member.name}</div>
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <div>결제 ₩{member.paid.toLocaleString()}</div>
                        <div>지출 ₩{member.spent.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold text-sm ${
                        member.balance > 0
                          ? 'text-green-600'
                          : member.balance < 0
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {member.balance > 0 ? '+' : member.balance < 0 ? '-' : ''}₩{Math.abs(member.balance).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {member.balance > 0 ? '받을 금액' : member.balance < 0 ? '보낼 금액' : '정산 완료'}
                    </div>
                  </div>
                </div>
              ))}
              {/* 총 공유 금액 + 간편정산 버튼 */}
              {totalSharedAmount > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 mt-4">
                  <div className="text-center">
                    <div className="text-sm text-blue-600 mb-1">총 공유 지출</div>
                    <div className="text-xl font-bold text-blue-900">₩{totalSharedAmount.toLocaleString()}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      1인당 ₩{Math.round(totalSharedAmount / Math.max(1, members.length)).toLocaleString()}
                    </div>
                    <button
                      onClick={() => setShowSettlement(true)}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors !rounded-button text-sm flex items-center gap-2 mx-auto"
                    >
                      <i className="ri-money-dollar-circle-line text-lg"></i>
                      간편 정산
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-team-line text-2xl text-gray-400"></i>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">동행자가 없습니다</h4>
              <p className="text-gray-500 text-sm mb-4">여행 동행자를 추가해보세요!</p>
              <button
                onClick={() => setShowAddMember(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors !rounded-button"
              >
                <i className="ri-user-add-line text-lg"></i>
                동행자 추가
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {sharedExpenses.length > 0 ? (
            <div className="space-y-3">
              {sharedExpenses.map((expense) => (
                <div key={expense.id} className="p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleEditExpense(expense)}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{expense.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {expense.paidBy}님이 결제 • {expense.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-sm">₩{expense.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {expense.participants.length}명 분할
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {expense.participants.map((participant, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-money-dollar-circle-line text-2xl text-gray-400"></i>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">공유 지출이 없습니다</h4>
              <p className="text-gray-500 text-sm">동행자와 함께한 지출을 기록해보세요!</p>
            </div>
          )}
        </div>
      )}

      {/* 동행자 추가 모달 */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-add-line text-2xl text-blue-500"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">동행자 추가</h3>
              <p className="text-gray-600 text-sm">함께 여행하는 사람의 이름을 입력하세요</p>
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                maxLength={20}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddMember(false);
                  setNewMemberName('');
                }}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors !rounded-button"
              >
                취소
              </button>
              <button
                onClick={handleAddMember}
                disabled={!newMemberName.trim()}
                className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors !rounded-button"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 멤버 수정 모달 */}
      {showEditMember && editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-edit-line text-2xl text-orange-500"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">멤버 정보 수정</h3>
              <p className="text-gray-600 text-sm">멤버의 정보를 수정하세요</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                <input
                  type="text"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="멤버 이름"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  maxLength={20}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowEditMember(false);
                  setEditingMember(null);
                  setMemberForm({
                    name: ''
                  });
                }}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors !rounded-button"
              >
                취소
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-3 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-colors !rounded-button"
              >
                삭제
              </button>
              <button
                onClick={handleUpdateMember}
                disabled={!memberForm.name.trim()}
                className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors !rounded-button"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 멤버 삭제 확인 모달 */}
      {showDeleteConfirm && editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-delete-bin-line text-2xl text-red-500"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">멤버 삭제</h3>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">{editingMember.name}</span>님을 삭제하시겠습니까?
              </p>
              <p className="text-red-500 text-xs mt-1">삭제 후에는 복구할 수 없습니다.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors !rounded-button"
              >
                취소
              </button>
              <button
                onClick={handleDeleteMember}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors !rounded-button"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 지출 내역 추가 모달 */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-add-line text-2xl text-green-500"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">공유 지출 추가</h3>
              <p className="text-gray-600 text-sm">동행자와 함께한 지출을 추가하세요</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">지출 내용</label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="예) 저녁식사, 택시비, 입장료"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">금액</label>
                <input
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">결제자</label>
                <div className="space-y-2">
                  {members.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => setExpenseForm((prev) => ({ ...prev, paidBy: member.name }))}
                      className={`w-full p-3 rounded-xl border text-left transition-colors !rounded-button ${
                        expenseForm.paidBy === member.name
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                          style={{
                            background: `linear-gradient(135deg, ${member.avatar} 0%, ${member.avatar}CC 100%)`
                          }}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{member.name}</span>
                        {expenseForm.paidBy === member.name && (
                          <i className="ri-check-line text-green-500 ml-auto text-lg"></i>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  참여 멤버 ({expenseForm.participants.length}명 선택)
                </label>
                <div className="space-y-2">
                  {members.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => toggleParticipant(member.name)}
                      className={`w-full p-3 rounded-xl border text-left transition-colors !rounded-button ${
                        expenseForm.participants.includes(member.name)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                          style={{
                            background: `linear-gradient(135deg, ${member.avatar} 0%, ${member.avatar}CC 100%)`
                          }}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{member.name}</span>
                        {expenseForm.participants.includes(member.name) && (
                          <i className="ri-check-line text-green-500 ml-auto text-lg"></i>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {expenseForm.participants.length > 0 && (
                  <div className="mt-2 text-xs text-green-600">
                    1인당 ₩{Math.round(Number(expenseForm.amount) / expenseForm.participants.length || 0).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddExpense(false);
                  setExpenseForm({
                    description: '',
                    amount: '',
                    paidBy: '',
                    participants: []
                  });
                }}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors !rounded-button"
              >
                취소
              </button>
              <button
                onClick={handleAddExpense}
                disabled={
                  !expenseForm.description.trim() ||
                  !expenseForm.amount ||
                  !expenseForm.paidBy ||
                  expenseForm.participants.length === 0
                }
                className="flex-1 py-3 px-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors !rounded-button"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 정산 모달 */}
      {showSettlement && members.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-money-dollar-circle-line text-2xl text-blue-500"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">간편 정산</h3>
              <p className="text-gray-600 text-sm">멤버 간 정산 내역을 확인하세요</p>
            </div>

            <div className="space-y-3 mb-6">
              {members
                .filter((member) => member.balance !== 0)
                .map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        style={{
                          background: `linear-gradient(135deg, ${member.avatar} 0%, ${member.avatar}CC 100%)`
                        }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{member.name}</span>
                    </div>
                    <div
                      className={`font-bold text-sm ${
                        member.balance > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {member.balance > 0 ? '+' : '-'}₩{Math.abs(member.balance).toLocaleString()}
                    </div>
                  </div>
                ))}
            </div>

            <button
              onClick={() => setShowSettlement(false)}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors !rounded-button"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 지출 내역 수정 모달 */}
      {showEditExpense && editingExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-edit-line text-2xl text-orange-500"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">공유 지출 수정</h3>
              <p className="text-gray-600 text-sm">지출 내역을 수정하세요</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">지출 내용</label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="예) 저녁식사, 택시비, 입장료"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">금액</label>
                <input
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">결제자</label>
                <div className="space-y-2">
                  {members.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => setExpenseForm((prev) => ({ ...prev, paidBy: member.name }))}
                      className={`w-full p-3 rounded-xl border text-left transition-colors !rounded-button ${
                        expenseForm.paidBy === member.name
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                          style={{
                            background: `linear-gradient(135deg, ${member.avatar} 0%, ${member.avatar}CC 100%)`
                          }}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{member.name}</span>
                        {expenseForm.paidBy === member.name && (
                          <i className="ri-check-line text-orange-500 ml-auto text-lg"></i>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  참여 멤버 ({expenseForm.participants.length}명 선택)
                </label>
                <div className="space-y-2">
                  {members.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => toggleParticipant(member.name)}
                      className={`w-full p-3 rounded-xl border text-left transition-colors !rounded-button ${
                        expenseForm.participants.includes(member.name)
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                          style={{
                            background: `linear-gradient(135deg, ${member.avatar} 0%, ${member.avatar}CC 100%)`
                          }}
                        >
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{member.name}</span>
                        {expenseForm.participants.includes(member.name) && (
                          <i className="ri-check-line text-orange-500 ml-auto text-lg"></i>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                {expenseForm.participants.length > 0 && (
                  <div className="mt-2 text-xs text-orange-600">
                    1인당 ₩{Math.round(Number(expenseForm.amount) / expenseForm.participants.length || 0).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowEditExpense(false);
                  setEditingExpense(null);
                  setExpenseForm({
                    description: '',
                    amount: '',
                    paidBy: '',
                    participants: []
                  });
                }}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors !rounded-button"
              >
                취소
              </button>
              <button
                onClick={() => setShowDeleteExpenseConfirm(true)}
                className="px-4 py-3 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-colors !rounded-button"
              >
                삭제
              </button>
              <button
                onClick={handleUpdateExpense}
                disabled={
                  !expenseForm.description.trim() ||
                  !expenseForm.amount ||
                  !expenseForm.paidBy ||
                  expenseForm.participants.length === 0
                }
                className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors !rounded-button"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 정산 금액 이전 모달 */}
      {showBalanceTransferModal && memberToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-exchange-line text-2xl text-yellow-600"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">정산 금액 처리</h3>
              <p className="text-gray-600 text-sm mb-4">
                <span className="font-medium">{memberToDelete.name}</span>님의 
                {memberToDelete.balance > 0 ? (
                  <span className="text-green-600"> 받을 금액 ₩{memberToDelete.balance.toLocaleString()}</span>
                ) : (
                  <span className="text-red-600"> 보낼 금액 ₩{Math.abs(memberToDelete.balance).toLocaleString()}</span>
                )}을 어떻게 처리하시겠습니까?
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {/* 다른 멤버에게 이전 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  다른 동행자에게 이전
                </label>
                <div className="space-y-2">
                  {members
                    .filter(member => member.id !== memberToDelete.id)
                    .map((member) => (
                      <button
                        key={member.id}
                        onClick={() => setSelectedTransferMember(member.id)}
                        className={`w-full p-3 rounded-xl border text-left transition-colors !rounded-button ${
                          selectedTransferMember === member.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                            style={{
                              background: `linear-gradient(135deg, ${member.avatar} 0%, ${member.avatar}CC 100%)`
                            }}
                          >
                            {member.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{member.name}</span>
                          {selectedTransferMember === member.id && (
                            <i className="ri-check-line text-blue-500 ml-auto text-lg"></i>
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* 금액 삭제 옵션 */}
              <div>
                <button
                  onClick={() => setSelectedTransferMember(null)}
                  className={`w-full p-3 rounded-xl border text-left transition-colors !rounded-button ${
                    selectedTransferMember === null
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <i className="ri-delete-bin-line text-red-500 text-sm"></i>
                    </div>
                    <span className="font-medium text-gray-900 text-sm">금액 삭제</span>
                    {selectedTransferMember === null && (
                      <i className="ri-check-line text-red-500 ml-auto text-lg"></i>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-11">
                    정산 금액을 완전히 삭제합니다
                  </p>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelBalanceTransfer}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors !rounded-button"
              >
                취소
              </button>
              <button
                onClick={handleBalanceTransfer}
                className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors !rounded-button"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 지출 내역 삭제 확인 모달 */}
      {showDeleteExpenseConfirm && editingExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-delete-bin-line text-2xl text-red-500"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">지출 내역 삭제</h3>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">{editingExpense.description}</span> 지출 내역을 삭제하시겠습니까?
              </p>
              <p className="text-red-500 text-xs mt-1">삭제 후에는 복구할 수 없습니다.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteExpenseConfirm(false)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors !rounded-button"
              >
                취소
              </button>
              <button
                onClick={handleDeleteExpense}
                className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors !rounded-button"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
