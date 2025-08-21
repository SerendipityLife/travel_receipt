
'use client';

import { useState, useRef, useEffect } from 'react';
import TripInviteModal from './TripInviteModal';

interface TripCardProps {
  trip: {
    id: number | string;
    creatorId?: string;
    title: string;
    date: string;
    totalAmount: number;
    days: number;
    receiptCount?: number;
    receipts?: Array<{
      id: number;
      store: string;
      date: string;
      time: string;
      amount: number;
      category: string;
      items: number;
    }>;
    budget?: {
      daily: number;
      total: number;
      spent: number;
      remaining: number;
      daysLeft: number;
    };
    members?: Array<{
      id: string;
      name: string;
      permission: 'editor' | 'viewer';
      joinedAt: string;
      inviteCode: string;
    }>;
  };
  trips?: any[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  onTitleUpdate?: (newTitle: string) => void;
  onDelete?: () => void;
  isCreator?: boolean; // 여행 생성자인지 여부
  onGenerateInviteCode?: (tripId: string) => Promise<string>;
  onRemoveMember?: (tripId: string, memberId: string) => void;
  onUpdateMemberPermission?: (tripId: string, memberId: string, permission: 'editor' | 'viewer') => void;
  onUpdateMemberInfo?: (tripId: string, memberId: string, name: string, permission: 'editor' | 'viewer') => void;
}

export default function TripCard({ 
  trip, 
  trips = [], 
  currentIndex = 0, 
  onIndexChange, 
  onTitleUpdate, 
  onDelete,
  isCreator = true, // 기본값은 생성자로 설정
  onGenerateInviteCode,
  onRemoveMember,
  onUpdateMemberPermission,
  onUpdateMemberInfo
}: TripCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(trip.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showBudgetDetail, setShowBudgetDetail] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isDoubleClick, setIsDoubleClick] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditTitle(trip.title);
    setIsEditing(false);
  }, [trip.title, currentIndex]);

  // Reset card states when editing mode changes
  useEffect(() => {
    if (!isEditing) {
      // Reset all card states when exiting edit mode
      setIsDragging(false);
      setTranslateX(0);
      setIsDoubleClick(false);
      setLastClickTime(0);
    }
  }, [isEditing]);



  const handleSave = () => {
    if (editTitle.trim() && onTitleUpdate) {
      onTitleUpdate(editTitle.trim());
    }
    setIsEditing(false);
    // Reset all card states after editing
    setIsDragging(false);
    setTranslateX(0);
    setIsDoubleClick(false);
    setLastClickTime(0);
  };

  const handleCancel = () => {
    setEditTitle(trip.title);
    setIsEditing(false);
    // Reset all card states after editing
    setIsDragging(false);
    setTranslateX(0);
    setIsDoubleClick(false);
    setLastClickTime(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };



  const handleCardClick = (e: React.MouseEvent) => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;
    
    if (timeDiff < 300 && timeDiff > 0) {
      // Double click detected
      setIsDoubleClick(true);
      if (isCreator && !isEditing) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Double click detected for editing!');
        setIsEditing(true);
        setEditTitle(trip.title);
      }
    } else {
      // Single click
      setIsDoubleClick(false);
      if (!isEditing) {
        setIsDragging(false);
        setTranslateX(0);
      }
    }
    
    setLastClickTime(currentTime);
    
    // Reset double-click state after a short delay
    if (timeDiff < 300 && timeDiff > 0) {
      setTimeout(() => {
        setIsDoubleClick(false);
      }, 500);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isEditing || trips.length <= 1 || isDoubleClick) return;
    // 더블 클릭을 방해하지 않도록 지연
    setTimeout(() => {
      if (!isDoubleClick) {
        setIsDragging(true);
        setIsTransitioning(false);
        setStartX(e.touches[0].clientX);
        setCurrentX(e.touches[0].clientX);
      }
    }, 100);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isEditing || trips.length <= 1) return;
    setCurrentX(e.touches[0].clientX);
    const deltaX = e.touches[0].clientX - startX;
    setTranslateX(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isEditing || trips.length <= 1) return;
    setIsDragging(false);

    const deltaX = currentX - startX;
    const threshold = 100;

    if (Math.abs(deltaX) > threshold && onIndexChange) {
      setIsTransitioning(true);
      if (deltaX > 0) {
        // Swipe right - go to previous card or loop to last card
        setTranslateX(400);
        setTimeout(() => {
          const newIndex = currentIndex > 0 ? currentIndex - 1 : trips.length - 1;
          onIndexChange(newIndex);
          // sessionStorage에 새로운 인덱스 저장
          sessionStorage.setItem('lastTripIndex', newIndex.toString());
          setTranslateX(0);
          setIsTransitioning(false);
        }, 300);
      } else if (deltaX < 0) {
        // Swipe left - go to next card or loop to first card
        setTranslateX(-400);
        setTimeout(() => {
          const newIndex = currentIndex < trips.length - 1 ? currentIndex + 1 : 0;
          onIndexChange(newIndex);
          // sessionStorage에 새로운 인덱스 저장
          sessionStorage.setItem('lastTripIndex', newIndex.toString());
          setTranslateX(0);
          setIsTransitioning(false);
        }, 300);
      } else {
        setTranslateX(0);
      }
    } else {
      setTranslateX(0);
    }
  };

  const handleMouseStart = (e: React.MouseEvent) => {
    if (isEditing || trips.length <= 1 || isDoubleClick) return;
    // 더블 클릭을 방해하지 않도록 지연
    setTimeout(() => {
      if (!isDoubleClick) {
        setIsDragging(true);
        setIsTransitioning(false);
        setStartX(e.clientX);
        setCurrentX(e.clientX);
      }
    }, 100);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isEditing || trips.length <= 1) return;
    setCurrentX(e.clientX);
    const deltaX = e.clientX - startX;
    setTranslateX(deltaX);
  };

  const handleMouseEnd = () => {
    if (!isDragging || isEditing || trips.length <= 1) return;
    setIsDragging(false);

    const deltaX = currentX - startX;
    const threshold = 100;

    if (Math.abs(deltaX) > threshold && onIndexChange) {
      setIsTransitioning(true);
      if (deltaX > 0) {
        // Swipe right - go to previous card or loop to last card
        setTranslateX(400);
        setTimeout(() => {
          const newIndex = currentIndex > 0 ? currentIndex - 1 : trips.length - 1;
          onIndexChange(newIndex);
          // sessionStorage에 새로운 인덱스 저장
          sessionStorage.setItem('lastTripIndex', newIndex.toString());
          setTranslateX(0);
          setIsTransitioning(false);
        }, 300);
      } else if (deltaX < 0) {
        // Swipe left - go to next card or loop to first card
        setTranslateX(-400);
        setTimeout(() => {
          const newIndex = currentIndex < trips.length - 1 ? currentIndex + 1 : 0;
          onIndexChange(newIndex);
          // sessionStorage에 새로운 인덱스 저장
          sessionStorage.setItem('lastTripIndex', newIndex.toString());
          setTranslateX(0);
          setIsTransitioning(false);
        }, 300);
      } else {
        setTranslateX(0);
      }
    } else {
      setTranslateX(0);
    }
  };

  useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (!isDragging || isEditing || trips.length <= 1) return;
      setCurrentX(e.clientX);
      const deltaX = e.clientX - startX;
      setTranslateX(deltaX);
    };

    const handleMouseUpGlobal = () => {
      if (!isDragging || isEditing || trips.length <= 1) return;
      setIsDragging(false);

      const deltaX = currentX - startX;
      const threshold = 100;

      if (Math.abs(deltaX) > threshold && onIndexChange) {
        setIsTransitioning(true);
        if (deltaX > 0) {
          // Swipe right - go to previous card or loop to last card
          setTranslateX(400);
          setTimeout(() => {
            const newIndex = currentIndex > 0 ? currentIndex - 1 : trips.length - 1;
            onIndexChange(newIndex);
            // sessionStorage에 새로운 인덱스 저장
            sessionStorage.setItem('lastTripIndex', newIndex.toString());
            setTranslateX(0);
            setIsTransitioning(false);
          }, 300);
        } else if (deltaX < 0) {
          // Swipe left - go to next card or loop to first card
          setTranslateX(-400);
          setTimeout(() => {
            const newIndex = currentIndex < trips.length - 1 ? currentIndex + 1 : 0;
            onIndexChange(newIndex);
            // sessionStorage에 새로운 인덱스 저장
            sessionStorage.setItem('lastTripIndex', newIndex.toString());
            setTranslateX(0);
            setIsTransitioning(false);
          }, 300);
        } else {
          setTranslateX(0);
        }
      } else {
        setTranslateX(0);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleMouseUpGlobal);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveGlobal);
      document.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isDragging, startX, currentX, currentIndex, trips.length, onIndexChange, isEditing]);

  const cardColors = [
    {
      background: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 25%, #42A5F5 50%, #5C6BC0 75%, #7986CB 100%)',
      shadowColor: 'rgba(79, 195, 247, 0.3), rgba(89, 134, 203, 0.2), rgba(66, 165, 245, 0.15)'
    },
    {
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 25%, #FF6B9D 50%, #C44569 75%, #F8B500 100%)',
      shadowColor: 'rgba(255, 107, 107, 0.3), rgba(196, 69, 105, 0.2), rgba(255, 139, 83, 0.15)'
    },
    {
      background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 25%, #093637 50%, #20BF55 75%, #01BAEF 100%)',
      shadowColor: 'rgba(78, 205, 196, 0.3), rgba(68, 160, 141, 0.2), rgba(32, 191, 85, 0.15)'
    },
    {
      background: 'linear-gradient(135deg, #A8E6CF 0%, #7FCDCD 25%, #6C5B7B 50%, #C06C84 75%, #F67280 100%)',
      shadowColor: 'rgba(168, 230, 207, 0.3), rgba(127, 205, 205, 0.2), rgba(192, 108, 132, 0.15)'
    },
    {
      background: 'linear-gradient(135deg, #FFD93D 0%, #6BCF7F 25%, #4D96FF 50%, #9B59B6 75%, #F39C12 100%)',
      shadowColor: 'rgba(255, 217, 61, 0.3), rgba(107, 207, 127, 0.2), rgba(77, 150, 255, 0.15)'
    },
    {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      shadowColor: 'rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.2), rgba(240, 147, 251, 0.15)'
    }
  ];

  const currentTheme = cardColors[currentIndex % cardColors.length];

  const budgetProgressPercentage = trip.budget && trip.budget.total > 0 
    ? (trip.budget.spent / trip.budget.total) * 100 
    : 0;
  const isBudgetOverspent = trip.budget && trip.budget.spent > trip.budget.total;

  return (
    <div className="relative overflow-hidden">
      <div
        ref={containerRef}
        className={`relative rounded-2xl p-6 text-white overflow-hidden ${
          isEditing ? 'select-text' : 'select-none cursor-grab active:cursor-grabbing'
        }`}
        onClick={handleCardClick}
        style={{
          background: currentTheme.background,
          boxShadow: `0 12px 40px ${currentTheme.shadowColor.split(', ')[0]}, 0 6px 20px ${currentTheme.shadowColor.split(', ')[1]}, 0 2px 8px ${currentTheme.shadowColor.split(', ')[2]}`,
          transform: `translateX(${translateX}px) ${isDragging ? `rotateY(${translateX * 0.1}deg)` : 'rotateY(0deg)'}`,
          transition: isDragging || isTransitioning ? (isTransitioning ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none') : 'transform 0.3s ease',
          transformStyle: 'preserve-3d',
          opacity: Math.max(0.3, 1 - Math.abs(translateX) / 600),
          scale: Math.max(0.9, 1 - Math.abs(translateX) / 1000),
          filter: `blur(${Math.abs(translateX) / 200}px) brightness(1.1) saturate(1.2)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseStart}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseEnd}
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6 gap-3">
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="mb-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full text-lg font-bold bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white/60"
                    placeholder="여행 제목을 입력하세요"
                    autoFocus
                    maxLength={25}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSave}
                      className="px-3 py-1 bg-white/30 rounded-full text-sm backdrop-blur-sm hover:bg-white/40 transition-colors !rounded-button"
                    >
                      저장
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm hover:bg-white/30 transition-colors !rounded-button"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h2 
                        className={`text-xl font-bold break-words leading-tight ${isCreator ? 'cursor-pointer hover:text-white/90 transition-colors select-none' : ''}`}
                        title={isCreator ? '카드를 더블 클릭하여 제목 수정' : trip.title}
                      >
                        {trip.title}
                      </h2>
                    </div>
                    <div className="flex-shrink-0">
                      {isCreator ? (
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30 whitespace-nowrap">
                          생성자
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30 whitespace-nowrap">
                          동행자
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-white/80 text-sm whitespace-nowrap">{trip.date}</p>
                </>
              )}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {isCreator && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors !rounded-button"
                  title="동행자 초대"
                >
                  <i className="ri-user-add-line text-sm"></i>
                </button>
              )}
              {isCreator && (
                <button
                  onClick={handleDeleteClick}
                  className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors !rounded-button"
                >
                  <i className="ri-delete-bin-line text-sm"></i>
                </button>
              )}
            </div>
          </div>

          {trip.budget && trip.budget.total > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80 text-sm">예산 진행률</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${isBudgetOverspent ? 'text-red-200' : 'text-white'}`}>
                    {Math.round(budgetProgressPercentage)}%
                  </span>
                  <span className="text-white/60">|</span>
                  <span className={`text-sm font-bold ${isBudgetOverspent ? 'text-red-200' : 'text-green-200'}`}>
                    잔액 ₩{trip.budget.remaining.toLocaleString()}
                  </span>
                </div>
              </div>
              <div 
                className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors"
                onClick={() => setShowBudgetDetail(true)}
              >
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    isBudgetOverspent 
                      ? 'bg-gradient-to-r from-red-400 to-red-300' 
                      : budgetProgressPercentage > 80 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-400'
                  }`}
                  style={{ width: `${Math.min(budgetProgressPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-white/60 text-xs leading-tight break-words">₩{trip.budget.spent.toLocaleString()}</span>
                <span className="text-white/60 text-xs leading-tight break-words">₩{trip.budget.total.toLocaleString()}</span>
              </div>
            </div>
          )}




        </div>

        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-delete-bin-line text-2xl text-red-500"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">여행 삭제</h3>
              <p className="text-gray-600 text-sm">
                "{trip.title}" 여행을 삭제하시겠습니까?<br />
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 동행자 초대 모달 */}
      {showInviteModal && (
        <TripInviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          tripTitle={trip.title}
          tripId={trip.id.toString()}
          currentMembers={trip.members || []}
          isCreator={isCreator}
          onGenerateInviteCode={onGenerateInviteCode}
          onRemoveMember={onRemoveMember}
          onUpdateMemberPermission={onUpdateMemberPermission}
          onUpdateMemberInfo={onUpdateMemberInfo}
        />
      )}

      {/* 예산 상세 모달 */}
      {showBudgetDetail && trip.budget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-money-dollar-circle-line text-2xl text-blue-500"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">예산 상세</h3>
              <p className="text-gray-600 text-sm">현재 예산 사용 현황입니다</p>
            </div>

            <div className="space-y-4 mb-6">
              {/* 총 예산 진행현황 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">총 예산 진행현황</span>
                  <span className={`text-sm font-bold ${isBudgetOverspent ? 'text-red-600' : 'text-blue-600'}`}>
                    {Math.round(budgetProgressPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isBudgetOverspent ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(budgetProgressPercentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-600">₩{trip.budget.spent.toLocaleString()}</span>
                  <span className="text-xs text-gray-600">₩{trip.budget.total.toLocaleString()}</span>
                </div>
              </div>

              {/* 일일 예산 진행현황 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">일일 예산 진행현황</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-green-600">
                      {trip.days > 0 ? Math.round((trip.totalAmount / trip.days) / (trip.budget.total / trip.days) * 100) : 0}%
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm font-bold text-green-600">
                      잔액 ₩{Math.max(0, (trip.budget.total / trip.days) - (trip.totalAmount / trip.days)).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-green-500 to-teal-500"
                    style={{ width: `${Math.min(trip.days > 0 ? (trip.totalAmount / trip.days) / (trip.budget.total / trip.days) * 100 : 0, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-600">₩{trip.days > 0 ? Math.round(trip.totalAmount / trip.days) : 0}</span>
                  <span className="text-xs text-gray-600">₩{trip.days > 0 ? Math.round(trip.budget.total / trip.days) : 0}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowBudgetDetail(false)}
              className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 페이지 인디케이터 */}
      {trips.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {trips.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
