
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import TripCard from './components/TripCard';
import RecentReceipts from './components/RecentReceipts';
import CategoryBreakdown from './components/CategoryBreakdown';
import BudgetManagement from './components/BudgetManagement';
import TravelSharing from './components/TravelSharing';
import BottomNavigation from './components/BottomNavigation';
import PopularProducts from './ranking/PopularProducts';
import PopularStores from './ranking/PopularStores';
import PopularDestinations from './ranking/PopularDestinations';
import RegionalItems from './ranking/RegionalItems';
import ReviewsAndTips from './ranking/ReviewsAndTips';
import { tripStorage, receiptStorage, TripMember } from './utils/mockData';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [rankingTab, setRankingTab] = useState<'products' | 'stores' | 'destinations' | 'regional' | 'reviews'>('products');
  const searchParams = useSearchParams();
  
  // 현재 사용자 ID (실제로는 로그인 시스템에서 가져와야 함)
  // 테스트를 위해 user1로 변경 (생성자 역할 테스트)
  const currentUserId = 'user1';

  const [availableTrips, setAvailableTrips] = useState<any[]>([]);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [travelMembers, setTravelMembers] = useState<any[]>([]);
  const [sharedExpenses, setSharedExpenses] = useState<any[]>([]);
  const [showDateSelector, setShowDateSelector] = useState(false);

  const currentTrip = availableTrips[currentTripIndex] || null;

  // 초기 데이터 설정
  useEffect(() => {
    const initialTrips = [
      {
        id: 1,
        creatorId: "user1", // 여행 생성자 ID
        title: "오사카 맛집 투어",
        date: "2024-11-15 ~ 2024-11-18",
        totalAmount: 89200,
        days: 4,
        receiptCount: 8,
        expenses: {
          totalSpent: 89200,
          dailyAverage: 22300,
          days: 4,
          receipts: 8
        },
        categories: [
          { name: "음식", amount: 62400, percentage: 70, color: "bg-blue-500" },
          { name: "교통", amount: 15600, percentage: 17, color: "bg-green-500" },
          { name: "기타", amount: 11200, percentage: 13, color: "bg-pink-500" }
        ],
        budget: {
          daily: 30000,
          total: 120000,
          spent: 89200,
          remaining: 30800,
          daysLeft: 4
        },
        members: [
          {
            id: "1",
            name: "김친구",
            permission: "editor" as const,
            joinedAt: "2024-11-10T10:00:00Z",
            inviteCode: "TRIP123"
          },
          {
            id: "2",
            name: "이동행",
            permission: "viewer" as const,
            joinedAt: "2024-11-12T14:30:00Z",
            inviteCode: "TRIP456"
          }
        ],
        receipts: [
          {
            id: 1,
            store: "돈키호테 시부야점",
            date: "2024-11-16",
            time: "14:32",
            amount: 8950,
            category: "쇼핑",
            items: 3
          },
          {
            id: 2,
            store: "세븐일레븐 아사쿠사점",
            date: "2024-11-16",
            time: "09:15",
            amount: 2800,
            category: "음식",
            items: 2
          },
          {
            id: 3,
            store: "JR동일본 신주쿠역",
            date: "2024-11-15",
            time: "18:45",
            amount: 580,
            category: "교통",
            items: 1
          }
        ]
      }
    ];
    setAvailableTrips(initialTrips);
  }, []);

  // URL 쿼리 파라미터에서 tripIndex 확인하여 해당 여행 카드로 이동
  // 새로고침 시에는 첫 번째 카드부터 보여주기 위해 sessionStorage 사용
  useEffect(() => {
    const tripIndexParam = searchParams.get('tripIndex');
    
    // 새로고침 여부 확인 (sessionStorage에 저장된 값이 없으면 새로고침으로 간주)
    const lastTripIndex = sessionStorage.getItem('lastTripIndex');
    
    if (tripIndexParam && lastTripIndex !== null) {
      // URL 파라미터가 있고 이전 세션이 있으면 해당 카드로 이동 (영수증 추가 후 돌아온 경우)
      const tripIndex = parseInt(tripIndexParam);
      if (!isNaN(tripIndex) && tripIndex >= 0 && tripIndex < availableTrips.length) {
        setCurrentTripIndex(tripIndex);
      }
    } else {
      // 새로고침이거나 처음 방문한 경우 첫 번째 카드로 설정
      setCurrentTripIndex(0);
      // URL에서 tripIndex 파라미터 제거
      if (tripIndexParam) {
        const url = new URL(window.location.href);
        url.searchParams.delete('tripIndex');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [searchParams, availableTrips.length]);

  // 여행이 변경될 때 동행자 공유 데이터 초기화 (새로운 여행인 경우)
  const handleTripChange = (newIndex: number) => {
    setCurrentTripIndex(newIndex);
    
    // sessionStorage에 현재 여행 인덱스 저장
    sessionStorage.setItem('lastTripIndex', newIndex.toString());
    
    // 새로운 여행으로 변경할 때 동행자와 공유 지출 초기화
    const newTrip = availableTrips[newIndex];
    if (newTrip && newTrip.totalAmount === 0) {
      setTravelMembers([]);
      setSharedExpenses([]);
    }
  };

  const handleTitleUpdate = (newTitle: string) => {
    setAvailableTrips(prev =>
      prev.map((trip, index) =>
        index === currentTripIndex
          ? { ...trip, title: newTitle }
          : trip
      )
    );
  };

  const handleTripDelete = () => {
    const newTrips = availableTrips.filter((_, index) => index !== currentTripIndex);
    setAvailableTrips(newTrips);

    if (newTrips.length > 0) {
      const newIndex = currentTripIndex >= newTrips.length ? newTrips.length - 1 : currentTripIndex;
      setCurrentTripIndex(newIndex);
    } else {
      setCurrentTripIndex(0);
    }
  };

  // 초대코드 및 동행자 관리 함수들
  const handleGenerateInviteCode = async (tripId: string): Promise<string> => {
    try {
      // tripStorage를 사용하여 초대코드 생성
      const inviteCode = tripStorage.generateInviteCode(tripId);
      
      console.log(`초대코드 생성: ${tripId} -> ${inviteCode}`);
      
      return inviteCode;
    } catch (error) {
      console.error('초대코드 생성 실패:', error);
      throw error;
    }
  };

  const handleRemoveMember = (tripId: string, memberId: string) => {
    try {
      // tripStorage를 사용하여 동행자 제거
      const success = tripStorage.removeMember(tripId, memberId);
      
      if (success) {
        // UI 업데이트
        setAvailableTrips(prev =>
          prev.map(trip =>
            trip.id.toString() === tripId
              ? {
                  ...trip,
                  members: (trip.members || []).filter(member => member.id !== memberId)
                }
              : trip
          )
        );
      }
    } catch (error) {
      console.error('동행자 제거 실패:', error);
    }
  };

  const handleUpdateMemberPermission = (tripId: string, memberId: string, permission: 'editor' | 'viewer') => {
    try {
      // tripStorage를 사용하여 권한 업데이트
      const success = tripStorage.updateMemberPermission(tripId, memberId, permission);
      
      if (success) {
        // UI 업데이트
        setAvailableTrips(prev =>
          prev.map(trip =>
            trip.id.toString() === tripId
              ? {
                  ...trip,
                  members: (trip.members || []).map(member =>
                    member.id === memberId
                      ? { ...member, permission }
                      : member
                  )
                }
              : trip
          )
        );
      }
    } catch (error) {
      console.error('권한 업데이트 실패:', error);
    }
  };

  const handleUpdateMemberInfo = (tripId: string, memberId: string, name: string, permission: 'editor' | 'viewer') => {
    try {
      const success = tripStorage.updateMemberInfo(tripId, memberId, name, permission);
      if (success) {
        setAvailableTrips(prev =>
          prev.map(trip =>
            trip.id.toString() === tripId
              ? {
                  ...trip,
                  members: (trip.members || []).map(member =>
                    member.id === memberId
                      ? { ...member, name, permission }
                      : member
                  )
                }
              : trip
          )
        );
      }
    } catch (error) {
      console.error('멤버 정보 업데이트 실패:', error);
    }
  };

  // 현재 사용자의 권한을 가져오는 함수
  const getCurrentUserPermission = (trip: any): 'editor' | 'viewer' => {
    // 여행 생성자인 경우
    if (trip.creatorId === currentUserId) {
      return 'editor';
    }
    
    // 동행자인 경우 멤버 목록에서 권한 확인
    const currentMember = trip.members?.find((member: any) => 
      member.name === '현재사용자' || member.name === 'user1' || member.name === 'user2'
    );
    
    return currentMember?.permission || 'viewer';
  };

  const handleAddTrip = () => {
    setShowDateSelector(true);
  };

  const handleBudgetUpdate = (newBudget: { daily: number; total: number }) => {
    setAvailableTrips(prev =>
      prev.map((trip, index) =>
        index === currentTripIndex
          ? {
              ...trip,
              budget: {
                ...trip.budget,
                daily: newBudget.daily,
                total: newBudget.total,
                remaining: newBudget.total - trip.budget.spent
              }
            }
          : trip
      )
    );
  };

  const handleAddMember = (name: string) => {
    const newMember = {
      id: Math.floor(Math.random() * 1000000) + Date.now(),
      name: name,
      avatar: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      spent: 0,
      paid: 0,
      balance: 0
    };
    setTravelMembers(prev => [...prev, newMember]);
  };

  const handleDeleteMember = (memberId: number, balanceTransfer?: { toMemberId: number; amount: number }) => {
    setTravelMembers(prev => {
      const memberToDelete = prev.find(member => member.id === memberId);
      if (!memberToDelete) return prev;

      let newMembers = prev.filter(member => member.id !== memberId);

      // 정산 금액 이전 처리
      if (balanceTransfer && memberToDelete.balance !== 0) {
        newMembers = newMembers.map(member => {
          if (member.id === balanceTransfer.toMemberId) {
            // 받을 금액이면 다른 멤버에게 이전, 보낼 금액이면 다른 멤버의 부채 증가
            const transferAmount = memberToDelete.balance > 0 ? balanceTransfer.amount : -balanceTransfer.amount;
            return {
              ...member,
              balance: member.balance + transferAmount
            };
          }
          return member;
        });
      }

      return newMembers;
    });
  };

  const handleAddReceipt = (receipt: any) => {
    setAvailableTrips(prev =>
      prev.map((trip, index) =>
        index === currentTripIndex
          ? {
              ...trip,
              receipts: [...trip.receipts, receipt],
              totalAmount: trip.totalAmount + receipt.amount,
              expenses: {
                ...trip.expenses,
                totalSpent: trip.expenses.totalSpent + receipt.amount,
                receipts: trip.expenses.receipts + 1
              }
            }
          : trip
      )
    );
  };

  const handleDateSave = (startDate: string, endDate: string, title: string, members: string[], budget: { daily: number; total: number }) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const formatDate = (date: Date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const formatDateForTitle = (date: Date) => {
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const finalTitle = title.trim() || `${formatDateForTitle(start)} ~ ${formatDateForTitle(end)}`;

    // 기본 멤버 생성 (이름이 없는 경우 인원1, 인원2...)
    const defaultMembers = members.length > 0 ? members : ['인원1'];
    const travelMembersData = defaultMembers.map((name, index) => ({
      id: Math.floor(Math.random() * 1000000) + Date.now() + index,
      name: name,
      avatar: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      spent: 0,
      paid: 0,
      balance: 0
    }));

    const newTrip = {
      id: Math.floor(Math.random() * 1000000) + Date.now(),
      creatorId: currentUserId, // 현재 사용자가 생성자
      title: finalTitle,
      date: `${formatDate(start)} ~ ${formatDate(end)}`,
      totalAmount: 0,
      days: days,
      receiptCount: 0,
      expenses: {
        totalSpent: 0,
        dailyAverage: 0,
        days: days,
        receipts: 0
      },
      categories: [],
      budget: {
        daily: budget.daily || 0,
        total: budget.total || 0,
        spent: 0,
        remaining: budget.total || 0,
        daysLeft: days
      },
      members: [], // 새로운 여행은 빈 멤버 배열로 시작
      receipts: []
    };

    setAvailableTrips(prev => [...prev, newTrip]);
    setCurrentTripIndex(availableTrips.length);
    
    // 새로운 여행의 동행자 설정
    setTravelMembers(travelMembersData);
    setSharedExpenses([]);
    
    setShowDateSelector(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const rankingTabs = [
    { id: 'products', label: '인기상품', icon: 'ri-shopping-bag-line' },
    { id: 'stores', label: '인기매장', icon: 'ri-store-line' },
    { id: 'destinations', label: '인기여행지', icon: 'ri-map-pin-line' },
    { id: 'regional', label: '지역별', icon: 'ri-global-line' },
    { id: 'reviews', label: '리뷰&팁', icon: 'ri-chat-3-line' }
  ];

  if (activeTab === 'ranking') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white px-4 py-6 shadow-sm">
          <div className="text-center mb-4">
            <h1 className="text-lg font-semibold text-gray-900">랭킹</h1>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="ri-trophy-line text-xl text-yellow-600"></i>
              </div>
              <div>
                <h2 className="font-bold text-gray-900">여행자들의 선택</h2>
                <p className="text-sm text-gray-600">실제 영수증 데이터로 만든 진짜 랭킹</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pt-6">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {rankingTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRankingTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors !rounded-button flex items-center gap-2 ${
                  rankingTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <i className={`${tab.icon} text-lg`}></i>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {rankingTab === 'products' && <PopularProducts />}
            {rankingTab === 'stores' && <PopularStores />}
            {rankingTab === 'destinations' && <PopularDestinations />}
            {rankingTab === 'regional' && <RegionalItems />}
            {rankingTab === 'reviews' && <ReviewsAndTips />}
          </div>
        </div>

        <BottomNavigation
          onAddTrip={handleAddTrip}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-suitcase-line text-4xl text-gray-400"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">여행 기록이 없습니다</h2>
          <p className="text-gray-600 mb-6">새로운 여행을 시작해보세요!</p>
          <button
            onClick={handleAddTrip}
            className="px-8 py-4 bg-blue-500 text-white rounded-2xl font-medium hover:bg-blue-600 transition-colors !rounded-button flex items-center gap-2 mx-auto"
          >
            <i className="ri-add-line text-xl"></i>
            새로운 여행 추가
          </button>

          {showDateSelector && (
            <DateSelector
              onSave={handleDateSave}
              onCancel={() => setShowDateSelector(false)}
            />
          )}

          <BottomNavigation
            onAddTrip={handleAddTrip}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Pacifico, serif" }}>
            TravelReceipt
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <TripCard
          trip={currentTrip}
          onTitleUpdate={handleTitleUpdate}
          onDelete={handleTripDelete}
          trips={availableTrips}
          currentIndex={currentTripIndex}
          onIndexChange={handleTripChange}
          isCreator={currentTrip.creatorId === currentUserId}
          onGenerateInviteCode={handleGenerateInviteCode}
          onRemoveMember={handleRemoveMember}
          onUpdateMemberPermission={handleUpdateMemberPermission}
          onUpdateMemberInfo={handleUpdateMemberInfo}
        />
        <RecentReceipts 
          receipts={currentTrip?.receipts || []} 
          onAddReceipt={handleAddReceipt}
          currentTripIndex={currentTripIndex}
        />
        <BudgetManagement
          budget={currentTrip.budget}
          onBudgetUpdate={handleBudgetUpdate}
        />
        <TravelSharing
          members={travelMembers}
          sharedExpenses={sharedExpenses}
          isCreator={currentTrip.creatorId === currentUserId}
          currentUserPermission={getCurrentUserPermission(currentTrip)}
          onAddMember={handleAddMember}
          onDeleteMember={handleDeleteMember}
        />
        <CategoryBreakdown categories={currentTrip.categories} />
      </div>

      {showDateSelector && (
        <DateSelector
          onSave={handleDateSave}
          onCancel={() => setShowDateSelector(false)}
        />
      )}

      <BottomNavigation
        onAddTrip={handleAddTrip}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}

interface DateSelectorProps {
  onSave: (startDate: string, endDate: string, title: string, members: string[], budget: { daily: number; total: number }) => void;
  onCancel: () => void;
}

function DateSelector({ onSave, onCancel }: DateSelectorProps) {
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [title, setTitle] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('일본');
  const [budget, setBudget] = useState({ daily: 0, total: 0 });
  const [showBudgetSection, setShowBudgetSection] = useState(false);

  const handleSave = () => {
    if (selectedDates.start && selectedDates.end) {
      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };
      onSave(formatDate(selectedDates.start), formatDate(selectedDates.end), title, [selectedCountry], budget);
    }
  };



  const generateCalendarDays = () => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
      const isPast = date < today;
      const isSelected = (selectedDates.start && date.getTime() === selectedDates.start.getTime()) ||
        (selectedDates.end && date.getTime() === selectedDates.end.getTime());
      const isInRange = selectedDates.start && selectedDates.end &&
        date >= selectedDates.start && date <= selectedDates.end;

      days.push({
        date,
        isCurrentMonth,
        isPast,
        isSelected,
        isInRange
      });
    }

    return days;
  };

  const handleDateClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;

    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      setSelectedDates({ start: date, end: null });
      setIsSelectingEnd(true);
    } else if (selectedDates.start && !selectedDates.end) {
      if (date >= selectedDates.start) {
        setSelectedDates({ ...selectedDates, end: date });
        setIsSelectingEnd(false);
      } else {
        setSelectedDates({ start: date, end: null });
      }
    }
  };

  const changeMonth = (direction: number) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md h-auto max-h-[95vh] flex flex-col">
        <div className="flex-shrink-0 text-center p-6 pb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="ri-calendar-line text-xl text-blue-500"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">새로운 여행 추가</h3>
          <p className="text-gray-600 text-sm">여행 일정을 설정해주세요</p>
        </div>

        <div className="flex-1 px-6 overflow-y-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              여행 제목 (선택사항)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="입력하지 않으면 날짜가 제목이 됩니다"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              maxLength={50}
            />
          </div>

          {/* 여행 국가 설정 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">여행 국가</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="일본">일본</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">향후 다른 국가 추가 예정.</p>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => changeMonth(-1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors !rounded-button"
              >
                <i className="ri-arrow-left-s-line text-lg"></i>
              </button>
              <h4 className="text-base font-semibold text-gray-900">
                {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
              </h4>
              <button
                onClick={() => changeMonth(1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors !rounded-button"
              >
                <i className="ri-arrow-right-s-line text-lg"></i>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekdays.map(day => (
                <div key={day} className="h-6 flex items-center justify-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateClick(day.date)}
                  disabled={day.isPast}
                  className={`h-8 flex items-center justify-center text-xs rounded-lg transition-colors !rounded-button ${day.isPast
                    ? 'text-gray-300 cursor-not-allowed'
                    : day.isSelected
                      ? 'bg-blue-500 text-white font-semibold'
                      : day.isInRange && !day.isSelected
                      ? 'bg-blue-100 text-blue-600'
                      : day.isCurrentMonth
                      ? 'text-gray-900 hover:bg-gray-100'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {day.date.getDate()}
                </button>
              ))}
            </div>
          </div>

          {selectedDates.start && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-blue-600 mb-1">선택된 일정</div>
              <div className="font-medium text-gray-900 text-sm">
                {selectedDates.start.toLocaleDateString('ko-KR')}
                {selectedDates.end && (
                  <>
                    {` ~ `}
                    {selectedDates.end.toLocaleDateString('ko-KR')}
                    <span className="text-xs text-gray-600 ml-2">
                      ({Math.ceil((selectedDates.end.getTime() - selectedDates.start.getTime()) / (1000 * 60 * 60 * 24)) + 1}일)
                    </span>
                  </>
                )}
                {selectedDates.start && !selectedDates.end && (
                  <div className="text-xs text-blue-600 mt-1">종료일을 선택해주세요</div>
                )}
              </div>
            </div>
          )}

          {/* 여행 예산 설정 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">여행 예산 (선택사항)</label>
              <button
                onClick={() => setShowBudgetSection(!showBudgetSection)}
                className="text-blue-600 text-sm hover:text-blue-700"
              >
                {showBudgetSection ? '숨기기' : '설정'}
              </button>
            </div>
            {showBudgetSection && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">총 예산</label>
                  <input
                    type="number"
                    value={budget.total || ''}
                    onChange={(e) => setBudget({ ...budget, total: Number(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">일일 예산</label>
                  <input
                    type="number"
                    value={budget.daily || ''}
                    onChange={(e) => setBudget({ ...budget, daily: Number(e.target.value) || 0 })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 p-6 pt-4">
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors !rounded-button text-sm"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedDates.start || !selectedDates.end}
              className="flex-1 py-2.5 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors !rounded-button text-sm"
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
