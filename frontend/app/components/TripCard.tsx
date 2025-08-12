
'use client';

import { useState, useRef, useEffect } from 'react';
import TripInviteModal from './TripInviteModal';

interface TripCardProps {
  trip: {
    id: string;
    title: string;
    date: string;
    totalAmount: number;
    days: number;
    receipts: number;
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditTitle(trip.title);
    setIsEditing(false);
  }, [trip.title, currentIndex]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditTitle(trip.title);
  };

  const handleSave = () => {
    if (editTitle.trim() && onTitleUpdate) {
      onTitleUpdate(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(trip.title);
    setIsEditing(false);
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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isEditing || trips.length <= 1) return;
    setIsDragging(true);
    setIsTransitioning(false);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
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
      if (deltaX > 0 && currentIndex > 0) {
        setTranslateX(400);
        setTimeout(() => {
          const newIndex = currentIndex - 1;
          onIndexChange(newIndex);
          // sessionStorage에 새로운 인덱스 저장
          sessionStorage.setItem('lastTripIndex', newIndex.toString());
          setTranslateX(0);
          setIsTransitioning(false);
        }, 300);
      } else if (deltaX < 0 && currentIndex < trips.length - 1) {
        setTranslateX(-400);
        setTimeout(() => {
          const newIndex = currentIndex + 1;
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
    if (isEditing || trips.length <= 1) return;
    setIsDragging(true);
    setIsTransitioning(false);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
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
      if (deltaX > 0 && currentIndex > 0) {
        setTranslateX(400);
        setTimeout(() => {
          const newIndex = currentIndex - 1;
          onIndexChange(newIndex);
          // sessionStorage에 새로운 인덱스 저장
          sessionStorage.setItem('lastTripIndex', newIndex.toString());
          setTranslateX(0);
          setIsTransitioning(false);
        }, 300);
      } else if (deltaX < 0 && currentIndex < trips.length - 1) {
        setTranslateX(-400);
        setTimeout(() => {
          const newIndex = currentIndex + 1;
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
        if (deltaX > 0 && currentIndex > 0) {
          setTranslateX(400);
          setTimeout(() => {
            const newIndex = currentIndex - 1;
            onIndexChange(newIndex);
            // sessionStorage에 새로운 인덱스 저장
            sessionStorage.setItem('lastTripIndex', newIndex.toString());
            setTranslateX(0);
            setIsTransitioning(false);
          }, 300);
        } else if (deltaX < 0 && currentIndex < trips.length - 1) {
          setTranslateX(-400);
          setTimeout(() => {
            const newIndex = currentIndex + 1;
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
                        className="text-xl font-bold break-words leading-tight" 
                        title={trip.title}
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
                  onClick={handleEditClick}
                  className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition-colors !rounded-button"
                >
                  <i className="ri-edit-line text-sm"></i>
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



          {isDragging && Math.abs(translateX) > 50 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`text-white/60 text-2xl transition-all duration-200 ${
                  Math.abs(translateX) > 100 ? 'scale-125 text-white/90' : 'scale-100'
                }`}
              >
                {translateX > 0 ? (
                  <i className="ri-arrow-left-line"></i>
                ) : (
                  <i className="ri-arrow-right-line"></i>
                )}
              </div>
            </div>
          )}
        </div>

        {trips.length > 1 && (
          <div className="flex justify-center gap-2 mt-3">
            {trips.map((_, index) => {
              const dotTheme = cardColors[index % cardColors.length];
              const isActive = index === currentIndex;

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (!isEditing && onIndexChange) {
                      onIndexChange(index);
                      // sessionStorage에 새로운 인덱스 저장
                      sessionStorage.setItem('lastTripIndex', index.toString());
                    }
                  }}
                  disabled={isEditing}
                  className={`w-3 h-3 rounded-full transition-all duration-300 !rounded-button ${
                    isEditing ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  style={{
                    background: isActive ? dotTheme.background : '#D1D5DB',
                    transform: isActive ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: isActive ? `0 2px 8px ${dotTheme.shadowColor.split(', ')[0]}` : 'none',
                  }}
                />
              );
            })}
          </div>
        )}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-delete-bin-line text-2xl text-red-500"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">여행 기록 삭제</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  이 여행의 모든 기록과 영수증이 삭제됩니다.
                  <br />
                  정말로 삭제하시겠습니까?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors !rounded-button"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors !rounded-button"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 동행자 초대 모달 */}
        <TripInviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          tripTitle={trip.title}
          tripId={trip.id}
          currentMembers={trip.members || []}
          isCreator={isCreator}
          onGenerateInviteCode={async (tripId: string) => {
            if (onGenerateInviteCode) {
              return await onGenerateInviteCode(tripId);
            }
            return '';
          }}
          onRemoveMember={(tripId: string, memberId: string) => {
            if (onRemoveMember) {
              onRemoveMember(tripId, memberId);
            }
          }}
          onUpdateMemberPermission={(tripId: string, memberId: string, permission: 'editor' | 'viewer') => {
            if (onUpdateMemberPermission) {
              onUpdateMemberPermission(tripId, memberId, permission);
            }
          }}
          onUpdateMemberInfo={(tripId: string, memberId: string, name: string, permission: 'editor' | 'viewer') => {
            if (onUpdateMemberInfo) {
              onUpdateMemberInfo(tripId, memberId, name, permission);
            }
          }}
        />

        {/* 예산 상세 모달 */}
        {showBudgetDetail && trip.budget && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">예산 상세</h3>
                <button
                  onClick={() => setShowBudgetDetail(false)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <i className="ri-close-line text-gray-600"></i>
                </button>
              </div>

              <div className="space-y-6">
                {/* 총 예산 진행현황 */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="ri-time-line text-blue-500 text-sm"></i>
                    </div>
                    <h4 className="font-medium text-gray-900">총 예산 진행현황</h4>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">진행률</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isBudgetOverspent ? 'text-red-600' : 'text-blue-600'}`}>
                        {Math.round(budgetProgressPercentage)}%
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className={`text-sm font-bold ${isBudgetOverspent ? 'text-red-600' : 'text-green-600'}`}>
                        잔액 ₩{trip.budget.remaining.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
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
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>₩{trip.budget.spent.toLocaleString()}</span>
                    <span>₩{trip.budget.total.toLocaleString()}</span>
                  </div>
                </div>

                {/* 일일 예산 진행현황 */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-calendar-line text-green-500 text-sm"></i>
                    </div>
                    <h4 className="font-medium text-gray-900">일일 예산 진행현황</h4>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">진행률</span>
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
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div 
                      className="h-3 rounded-full bg-green-500 transition-all duration-300"
                      style={{ 
                        width: `${Math.min(
                          trip.days > 0 ? (trip.totalAmount / trip.days) / (trip.budget.total / trip.days) * 100 : 0, 
                          100
                        )}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>₩{trip.days > 0 ? Math.round(trip.totalAmount / trip.days).toLocaleString() : '0'}</span>
                    <span>₩{trip.days > 0 ? Math.round(trip.budget.total / trip.days).toLocaleString() : '0'}</span>
                  </div>
                </div>

                {/* 지출 요약 */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-medium text-blue-900 mb-3">지출 요약</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-900">₩{trip.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-blue-600">총 지출 금액</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-900">
                        ₩{trip.days > 0 ? Math.round(trip.totalAmount / trip.days).toLocaleString() : '0'}
                      </div>
                      <div className="text-xs text-blue-600">일평균 지출</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
