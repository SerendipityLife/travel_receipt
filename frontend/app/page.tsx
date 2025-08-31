
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { useAuth } from '../lib/useAuth';
import { tripAPI } from '../lib/firebase-api';

export default function Home() {
    const { user, loading, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('home');
    const router = useRouter();
    const [rankingTab, setRankingTab] = useState<'products' | 'stores' | 'destinations' | 'regional' | 'reviews'>('products');
    const searchParams = useSearchParams();

    // 현재 사용자 ID (Firebase Auth에서 가져옴)
    const currentUserId = user?.uid || 'user1';

    const [availableTrips, setAvailableTrips] = useState<any[]>([]);
    const [currentTripIndex, setCurrentTripIndex] = useState(0);
    const [travelMembers, setTravelMembers] = useState<any[]>([]);
    const [sharedExpenses, setSharedExpenses] = useState<any[]>([]);
    const [showDateSelector, setShowDateSelector] = useState(false);
    const [showTripEdit, setShowTripEdit] = useState(false);
    const [showTitleEdit, setShowTitleEdit] = useState(false);
    const [editTitle, setEditTitle] = useState('');

    const currentTrip = availableTrips[currentTripIndex] || null;

    // 모든 useEffect를 최상단에 배치 (Hooks 규칙 준수)
    useEffect(() => {
        if (!user && !loading) {
            router.push('/auth');
        }
    }, [user, loading, router]);

    // Firebase에서 여행 데이터 로드
    useEffect(() => {
        if (user) { // 로그인된 경우에만 데이터 로드
            const loadTrips = async () => {
                try {
                    const trips = await tripAPI.getTrips();
                    console.log('Firebase에서 받은 여행 데이터:', trips);

                    // trips가 배열인지 확인
                    if (!Array.isArray(trips)) {
                        console.error('여행 데이터가 배열이 아님:', trips);
                        setAvailableTrips([]);
                        return;
                    }

                    // Firebase 데이터를 UI 형식으로 변환
                    const formattedTrips = trips.map((trip: any) => {
                        // Timestamp 객체를 날짜 문자열로 변환하는 함수
                        const formatTimestamp = (timestamp: any) => {
                            if (!timestamp) return '';
                            if (typeof timestamp === 'string') return timestamp;

                            try {
                                // Firebase Timestamp 객체 (toDate 메서드가 있는 경우)
                                if (timestamp.toDate && typeof timestamp.toDate === 'function') {
                                    const date = timestamp.toDate();
                                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                }

                                // Firebase Timestamp 객체 (_seconds가 있는 경우)
                                if (timestamp._seconds && typeof timestamp._seconds === 'number') {
                                    const date = new Date(timestamp._seconds * 1000);
                                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                }

                                // 일반 Date 객체
                                if (timestamp instanceof Date) {
                                    return `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}-${String(timestamp.getDate()).padStart(2, '0')}`;
                                }

                                // 숫자 (Unix timestamp)
                                if (typeof timestamp === 'number') {
                                    const date = new Date(timestamp);
                                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                }

                                // 객체인 경우 JSON.stringify로 확인
                                if (typeof timestamp === 'object') {
                                    console.log('객체 형태의 timestamp:', JSON.stringify(timestamp));
                                    // _seconds가 있는지 다시 확인
                                    if (timestamp._seconds) {
                                        const date = new Date(timestamp._seconds * 1000);
                                        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                    }
                                }

                                console.log('날짜 변환 실패 - timestamp:', timestamp, 'type:', typeof timestamp);
                                return '날짜 없음';
                            } catch (error) {
                                console.error('날짜 변환 중 에러:', error, 'timestamp:', timestamp);
                                return '날짜 오류';
                            }
                        };

                        // 디버깅: 날짜 데이터 출력
                        console.log('원본 날짜 데이터:', {
                            startDate: trip.startDate,
                            endDate: trip.endDate,
                            startDateType: typeof trip.startDate,
                            endDateType: typeof trip.endDate,
                            startDateKeys: trip.startDate ? Object.keys(trip.startDate) : 'null',
                            endDateKeys: trip.endDate ? Object.keys(trip.endDate) : 'null'
                        });

                        // 날짜 변환 테스트
                        const startDateFormatted = formatTimestamp(trip.startDate);
                        const endDateFormatted = formatTimestamp(trip.endDate);
                        console.log('변환된 날짜:', { startDateFormatted, endDateFormatted });

                        return {
                            id: trip.id,
                            creatorId: trip.userId,
                            title: trip.title,
                            date: `${formatTimestamp(trip.startDate)} ~ ${formatTimestamp(trip.endDate)}`,
                            totalAmount: trip.stats?.totalAmount || 0,
                            days: trip.stats?.days || 0,
                            receiptCount: trip.stats?.receiptCount || 0,
                            expenses: {
                                totalSpent: trip.stats?.totalAmount || 0,
                                dailyAverage: trip.stats?.dailyAverage || 0,
                                days: trip.stats?.days || 0,
                                receipts: trip.stats?.receiptCount || 0
                            },
                            categories: trip.categories || [],
                            budget: {
                                daily: trip.budget?.total ? Math.round(trip.budget.total / (trip.stats?.days || 1)) : 0,
                                total: trip.budget?.total || 0,
                                spent: trip.budget?.spent || 0,
                                remaining: trip.budget?.remaining || 0,
                                daysLeft: trip.stats?.days || 0
                            },
                            members: trip.members || [],
                            receipts: [] // 영수증은 별도로 로드
                        };
                    });

                    setAvailableTrips(formattedTrips);
                } catch (error) {
                    console.error('여행 데이터 로드 실패:', error);
                    // 에러 발생 시 빈 배열로 설정
                    setAvailableTrips([]);
                }
            };

            loadTrips();
        }
    }, [user]);

    // URL 쿼리 파라미터에서 tripIndex 확인하여 해당 여행 카드로 이동
    useEffect(() => {
        if (user) { // 로그인된 경우에만 실행
            const tripIndexParam = searchParams.get('tripIndex');
            const lastTripIndex = sessionStorage.getItem('lastTripIndex');

            if (tripIndexParam && lastTripIndex !== null) {
                const tripIndex = parseInt(tripIndexParam);
                if (!isNaN(tripIndex) && tripIndex >= 0 && tripIndex < availableTrips.length) {
                    setCurrentTripIndex(tripIndex);
                }
            } else {
                setCurrentTripIndex(0);
                if (tripIndexParam) {
                    const url = new URL(window.location.href);
                    url.searchParams.delete('tripIndex');
                    window.history.replaceState({}, '', url.toString());
                }
            }
        }
    }, [searchParams, availableTrips.length, user]);

    // 조건부 렌더링 (모든 Hook 호출 후에 배치)
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">로그인 페이지로 이동 중...</p>
                </div>
            </div>
        );
    }

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

    const handleTripDelete = async () => {
        console.log('handleTripDelete 함수 시작');
        try {
            if (!currentTrip) {
                console.log('currentTrip이 없음');
                alert('삭제할 여행이 없습니다.');
                return;
            }

            console.log('삭제할 여행:', currentTrip);
            console.log('여행 ID:', currentTrip.id);

            // Firebase에서 여행 삭제
            await tripAPI.deleteTrip(currentTrip.id);

            // 로컬 상태 업데이트
            const newTrips = availableTrips.filter((_, index) => index !== currentTripIndex);
            setAvailableTrips(newTrips);

            if (newTrips.length > 0) {
                const newIndex = currentTripIndex >= newTrips.length ? newTrips.length - 1 : currentTripIndex;
                setCurrentTripIndex(newIndex);
            } else {
                setCurrentTripIndex(0);
            }

            alert('여행이 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error('여행 삭제 실패:', error);
            alert('여행 삭제에 실패했습니다. 다시 시도해주세요.');
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

    // 여행 수정 관련 함수들
    const handleTripEdit = () => {
        setShowTripEdit(true);
    };

    const handleTripUpdate = async (startDate: string, endDate: string, title: string, members: string[], budget: { daily: number; total: number }) => {
        try {
            if (!currentTrip) return;

            // 날짜 형식 변환
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

            // 동행자 데이터 생성
            const travelMembersData = members.map((member, index) => ({
                id: `member-${index + 1}`,
                name: member,
                permission: 'viewer' as const,
                joinedAt: new Date().toISOString(),
                inviteCode: ''
            }));

            // 여행 데이터 업데이트
            const updatedTripData = {
                title: title || currentTrip.title,
                description: `${title || currentTrip.title} 여행`,
                startDate: startDate,
                endDate: endDate,
                location: '여행지',
                status: 'active',
                budget: {
                    total: budget.total || currentTrip.budget?.total || 100000,
                    currency: 'KRW',
                    spent: currentTrip.budget?.spent || 0,
                    remaining: (budget.total || currentTrip.budget?.total || 100000) - (currentTrip.budget?.spent || 0),
                    daily: budget.total ? Math.round(budget.total / days) : Math.round((currentTrip.budget?.total || 100000) / days)
                },
                stats: {
                    totalAmount: currentTrip.totalAmount || 0,
                    receiptCount: currentTrip.receiptCount || 0,
                    days: days,
                    dailyAverage: currentTrip.totalAmount ? Math.round(currentTrip.totalAmount / days) : 0
                },
                categories: currentTrip.categories || ['음식', '교통', '숙박', '쇼핑'],
                members: travelMembersData,
                sharedExpenses: []
            };

            // Firebase에 여행 업데이트
            await tripAPI.updateTrip(currentTrip.id, updatedTripData);

            // 로컬 상태 업데이트
            setAvailableTrips(prev =>
                prev.map(trip =>
                    trip.id === currentTrip.id
                        ? {
                            ...trip,
                            title: updatedTripData.title,
                            date: `${startDate} ~ ${endDate}`,
                            days: days,
                            budget: {
                                ...updatedTripData.budget,
                                daily: updatedTripData.budget.daily || Math.round(updatedTripData.budget.total / days)
                            },
                            members: updatedTripData.members
                        }
                        : trip
                )
            );

            setShowTripEdit(false);
            alert('여행이 성공적으로 수정되었습니다.');
        } catch (error) {
            console.error('여행 수정 실패:', error);
            alert('여행 수정에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 제목 편집 관련 함수들
    const handleTitleEdit = () => {
        setEditTitle(currentTrip.title);
        setShowTitleEdit(true);
    };

    const handleTitleSave = async () => {
        try {
            if (!editTitle.trim()) {
                alert('제목을 입력해주세요.');
                return;
            }

            // Firebase에 제목 업데이트
            await tripAPI.updateTrip(currentTrip.id, { title: editTitle.trim() });

            // 로컬 상태 업데이트
            setAvailableTrips(prev =>
                prev.map(trip =>
                    trip.id === currentTrip.id
                        ? { ...trip, title: editTitle.trim() }
                        : trip
                )
            );

            setShowTitleEdit(false);
            setEditTitle('');
        } catch (error) {
            console.error('제목 업데이트 실패:', error);
            alert('제목 업데이트에 실패했습니다.');
        }
    };

    const handleTitleCancel = () => {
        setShowTitleEdit(false);
        setEditTitle('');
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
            avatar: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
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

    const handleDateSave = async (startDate: string, endDate: string, title: string, members: string[], budget: { daily: number; total: number }) => {
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
            avatar: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            spent: 0,
            paid: 0,
            balance: 0
        }));

        try {
            // Firebase에 여행 데이터 저장
            const tripData = {
                title: finalTitle,
                description: `${finalTitle} 여행`,
                startDate: formatDate(start),
                endDate: formatDate(end),
                location: '여행지',
                status: 'active',
                budget: {
                    total: budget.total || 0,
                    currency: 'KRW',
                    spent: 0,
                    remaining: budget.total || 0
                },
                stats: {
                    totalAmount: 0,
                    receiptCount: 0,
                    days: days,
                    dailyAverage: 0
                },
                categories: [],
                members: [],
                sharedExpenses: []
            };

            console.log('여행 저장 시작:', tripData);

            const savedTrip = await tripAPI.createTrip(tripData);
            console.log('Firebase에 여행 저장 완료:', savedTrip);

            // 저장된 여행을 UI 형식으로 변환하여 로컬 상태 업데이트
            const formattedTrip = {
                id: savedTrip.id,
                creatorId: savedTrip.userId,
                title: savedTrip.title,
                date: `${savedTrip.startDate} ~ ${savedTrip.endDate}`,
                totalAmount: savedTrip.stats?.totalAmount || 0,
                days: savedTrip.stats?.days || days,
                receiptCount: savedTrip.stats?.receiptCount || 0,
                expenses: {
                    totalSpent: savedTrip.stats?.totalAmount || 0,
                    dailyAverage: savedTrip.stats?.dailyAverage || 0,
                    days: savedTrip.stats?.days || days,
                    receipts: savedTrip.stats?.receiptCount || 0
                },
                categories: savedTrip.categories || [],
                budget: {
                    daily: savedTrip.budget?.total ? Math.round(savedTrip.budget.total / (savedTrip.stats?.days || 1)) : 0,
                    total: savedTrip.budget?.total || 0,
                    spent: savedTrip.budget?.spent || 0,
                    remaining: savedTrip.budget?.remaining || 0,
                    daysLeft: savedTrip.stats?.days || days
                },
                members: savedTrip.members || [],
                receipts: []
            };

            setAvailableTrips(prev => [...prev, formattedTrip]);
            setCurrentTripIndex(availableTrips.length);

            // 새로운 여행의 동행자 설정
            setTravelMembers(travelMembersData);
            setSharedExpenses([]);

            setShowDateSelector(false);
        } catch (error) {
            console.error('여행 저장 실패:', error);
            console.error('에러 상세 정보:', {
                message: error.message,
                stack: error.stack,
                response: error.response
            });
            alert(`여행 저장에 실패했습니다: ${error.message}`);
        }
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
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-lg font-semibold text-gray-900">랭킹</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                {user.email}
                            </span>
                            <button
                                onClick={logout}
                                className="text-sm text-red-600 hover:text-red-800 transition-colors"
                            >
                                로그아웃
                            </button>
                        </div>
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
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors !rounded-button flex items-center gap-2 ${rankingTab === tab.id
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
            <div className="min-h-screen bg-gray-50 pb-20">
                {/* 상단바 추가 */}
                <div className="bg-white px-4 py-6 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div className="text-center flex-1">
                            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Pacifico, serif" }}>
                                TravelReceipt
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                {user.email}
                            </span>
                            <button
                                onClick={logout}
                                className="text-sm text-red-600 hover:text-red-800 transition-colors"
                            >
                                로그아웃
                            </button>
                        </div>
                    </div>
                </div>

                {/* 메인 콘텐츠 */}
                <div className="flex items-center justify-center flex-1 px-4">
                    <div className="text-center">
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
                    </div>
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

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white px-4 py-6 shadow-sm">
                <div className="flex justify-between items-center">
                    <div className="text-center flex-1">
                        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Pacifico, serif" }}>
                            TravelReceipt
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            {user.email}
                        </span>
                        <button
                            onClick={logout}
                            className="text-sm text-red-600 hover:text-red-800 transition-colors"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 py-6 space-y-6">
                {/* 개선된 여행 카드 */}
                <div
                    className="relative rounded-2xl p-6 text-white overflow-hidden select-none cursor-grab active:cursor-grabbing"
                    style={{
                        background: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 25%, #42A5F5 50%, #5C6BC0 75%, #7986CB 100%)',
                        boxShadow: '0 12px 40px rgba(79, 195, 247, 0.3), 0 6px 20px rgba(89, 134, 203, 0.2), 0 2px 8px rgba(66, 165, 245, 0.15)'
                    }}
                    onDoubleClick={handleTitleEdit}
                    onClick={(e) => {
                        // 버튼 영역 클릭 시 카드 클릭 이벤트 방지
                        const target = e.target as HTMLElement;
                        if (target.closest('button')) {
                            return;
                        }
                        console.log('카드 데이터:', currentTrip);
                    }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            {showTitleEdit ? (
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleTitleSave();
                                            if (e.key === 'Escape') handleTitleCancel();
                                        }}
                                        className="w-full text-lg font-bold bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white/60"
                                        placeholder="여행 제목을 입력하세요"
                                        autoFocus
                                        maxLength={25}
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTitleSave();
                                            }}
                                            className="px-3 py-1 bg-white/30 rounded-full text-sm backdrop-blur-sm hover:bg-white/40 transition-colors"
                                        >
                                            저장
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTitleCancel();
                                            }}
                                            className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm hover:bg-white/30 transition-colors"
                                        >
                                            취소
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold mb-2">{currentTrip.title}</h2>
                                    <p className="text-white/80 text-sm">{currentTrip.date}</p>
                                </>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    alert('동행자 초대 기능은 곧 추가됩니다!');
                                }}
                                title="동행자 초대"
                            >
                                <i className="ri-user-add-line text-sm"></i>
                            </button>
                            <button
                                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTripEdit();
                                }}
                                title="여행 수정"
                            >
                                <i className="ri-edit-line text-sm"></i>
                            </button>
                            <button
                                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors relative z-10"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('삭제 버튼 클릭됨');
                                    if (confirm(`"${currentTrip.title}" 여행을 삭제하시겠습니까?`)) {
                                        console.log('삭제 확인됨, handleTripDelete 호출');
                                        handleTripDelete();
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                title="여행 삭제"
                            >
                                <i className="ri-delete-bin-line text-sm"></i>
                            </button>
                        </div>
                    </div>

                    {/* 예산 정보 */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-white/80 text-sm">예산 진행률</span>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${currentTrip.budget?.spent > currentTrip.budget?.total ? 'text-red-200' : 'text-white'}`}>
                                    {currentTrip.budget?.total > 0 ? Math.round((currentTrip.budget.spent / currentTrip.budget.total) * 100) : 0}%
                                </span>
                                <span className="text-white/60">|</span>
                                <span className={`text-sm font-bold ${currentTrip.budget?.spent > currentTrip.budget?.total ? 'text-red-200' : 'text-green-200'}`}>
                                    잔액 ₩{(currentTrip.budget?.remaining || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors">
                            <div
                                className={`h-3 rounded-full transition-all duration-300 ${currentTrip.budget?.spent > currentTrip.budget?.total
                                    ? 'bg-gradient-to-r from-red-400 to-red-300'
                                    : currentTrip.budget?.total > 0 && (currentTrip.budget.spent / currentTrip.budget.total) > 0.8
                                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-300'
                                        : 'bg-gradient-to-r from-purple-500 to-pink-400'
                                    }`}
                                style={{
                                    width: `${currentTrip.budget?.total > 0 ? Math.min((currentTrip.budget.spent / currentTrip.budget.total) * 100, 100) : 0}%`
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-white/60 text-xs leading-tight break-words">₩{(currentTrip.budget?.spent || 0).toLocaleString()}</span>
                            <span className="text-white/60 text-xs leading-tight break-words">₩{(currentTrip.budget?.total || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    {/* 통계 정보 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="text-lg font-bold">₩{currentTrip.totalAmount.toLocaleString()}</div>
                            <div className="text-white/60 text-xs">총 지출 금액</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold">₩{Math.round((currentTrip.totalAmount || 0) / Math.max(currentTrip.days || 1, 1)).toLocaleString()}</div>
                            <div className="text-white/60 text-xs">일평균 지출</div>
                        </div>
                    </div>

                    {/* 배경 장식 */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                </div>
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

            {showTripEdit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="ri-edit-line text-2xl text-blue-500"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">여행 수정</h3>
                            <p className="text-gray-600 text-sm">여행 정보를 수정해주세요</p>
                        </div>
                        <DateSelector
                            onSave={handleTripUpdate}
                            onCancel={() => setShowTripEdit(false)}
                        />
                    </div>
                </div>
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