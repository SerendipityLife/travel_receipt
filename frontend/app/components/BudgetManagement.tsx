
'use client';

import { useState } from 'react';

interface Budget {
  daily: number;
  total: number;
  spent: number;
  remaining: number;
  daysLeft: number;
}

interface BudgetManagementProps {
  budget: Budget;
  onBudgetUpdate?: (newBudget: { daily: number; total: number }) => void;
}

export default function BudgetManagement({ budget, onBudgetUpdate }: BudgetManagementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [dailyBudget, setDailyBudget] = useState(budget.daily);
  const [totalBudget, setTotalBudget] = useState(budget.total);

  const totalProgressPercentage = budget.total > 0 ? (budget.spent / budget.total) * 100 : 0;
  const dailySpentAverage = Math.round(budget.spent / Math.max(1, budget.daysLeft));
  const dailyProgressPercentage = budget.daily > 0 ? (dailySpentAverage / budget.daily) * 100 : 0;
  
  const isTotalOverBudget = budget.spent > budget.total;
  const isDailyOverBudget = dailySpentAverage > budget.daily;

  const todayRemainingBudget = Math.max(0, budget.daily - dailySpentAverage);

  const handleSave = () => {
    if (onBudgetUpdate) {
      onBudgetUpdate({ daily: dailyBudget, total: totalBudget });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDailyBudget(budget.daily);
    setTotalBudget(budget.total);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">예산 관리</h3>
        <button 
          onClick={() => setIsEditing(true)}
          className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors !rounded-button"
        >
          <i className="ri-edit-line text-blue-600 text-sm"></i>
        </button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">일일 예산</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₩</span>
              <input
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(parseInt(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">총 예산</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₩</span>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(parseInt(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              onClick={handleSave}
              className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors !rounded-button"
            >
              저장
            </button>
            <button 
              onClick={handleCancel}
              className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors !rounded-button"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 총 예산 진행현황 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <i className="ri-pie-chart-line text-white text-xs"></i>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">총 예산 진행현황</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">진행률</span>
                <span className={`text-sm font-bold ${isTotalOverBudget ? 'text-red-600' : 'text-blue-600'}`}>
                  {Math.round(totalProgressPercentage)}%
                </span>
              </div>
              
              <div className="w-full bg-white/60 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isTotalOverBudget ? 'bg-red-500' : totalProgressPercentage > 80 ? 'bg-yellow-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                  style={{ width: `${Math.min(totalProgressPercentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center mt-3">
                <div className="bg-white/50 rounded-lg p-2">
                  <div className="text-xs text-gray-600 mb-1">총예산</div>
                  <div className="text-sm font-bold text-gray-900">₩{budget.total.toLocaleString()}</div>
                </div>
                <div className="bg-white/50 rounded-lg p-2">
                  <div className="text-xs text-gray-600 mb-1">사용금액</div>
                  <div className="text-sm font-bold text-blue-600">₩{budget.spent.toLocaleString()}</div>
                </div>
                <div className="bg-white/50 rounded-lg p-2">
                  <div className="text-xs text-gray-600 mb-1">사용가능금액</div>
                  <div className={`text-sm font-bold ${budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₩{budget.remaining.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 일일 예산 진행현황 */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <i className="ri-calendar-check-line text-white text-xs"></i>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">일일 예산 진행현황</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">진행률</span>
                <span className={`text-sm font-bold ${isDailyOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.round(dailyProgressPercentage)}%
                </span>
              </div>
              
              <div className="w-full bg-white/60 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isDailyOverBudget ? 'bg-red-500' : dailyProgressPercentage > 80 ? 'bg-yellow-500' : 'bg-gradient-to-r from-green-500 to-teal-500'
                  }`}
                  style={{ width: `${Math.min(dailyProgressPercentage, 100)}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center mt-3">
                <div className="bg-white/50 rounded-lg p-2">
                  <div className="text-xs text-gray-600 mb-1">총예산</div>
                  <div className="text-sm font-bold text-gray-900">₩{budget.daily.toLocaleString()}</div>
                </div>
                <div className="bg-white/50 rounded-lg p-2">
                  <div className="text-xs text-gray-600 mb-1">사용금액</div>
                  <div className="text-sm font-bold text-green-600">₩{dailySpentAverage.toLocaleString()}</div>
                </div>
                <div className="bg-white/50 rounded-lg p-2">
                  <div className="text-xs text-gray-600 mb-1">사용가능금액</div>
                  <div className={`text-sm font-bold ${todayRemainingBudget > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                    ₩{todayRemainingBudget.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 예산 요약 정보 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-wallet-3-line text-blue-600 text-sm"></i>
                </div>
                <div className={`text-lg font-bold mb-1 ${budget.remaining >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  ₩{budget.remaining.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">총 남은 예산</div>
              </div>
              
              <div className="bg-white rounded-lg p-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-calendar-todo-line text-green-600 text-sm"></i>
                </div>
                <div className={`text-lg font-bold mb-1 ${todayRemainingBudget > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                  ₩{todayRemainingBudget.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">오늘 남은 예산</div>
              </div>
              
              <div className="bg-white rounded-lg p-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-time-line text-purple-600 text-sm"></i>
                </div>
                <div className="text-lg font-bold text-purple-600 mb-1">{budget.daysLeft}일</div>
                <div className="text-xs text-gray-500">남은 기간</div>
              </div>
            </div>
          </div>

          {/* 예산 알림 */}
          {isTotalOverBudget && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <i className="ri-error-warning-line text-red-500"></i>
                <span className="text-sm font-medium text-red-800">총 예산을 초과했습니다!</span>
              </div>
              <p className="text-xs text-red-600 mt-1">
                총 예산보다 ₩{(budget.spent - budget.total).toLocaleString()} 더 지출했어요.
              </p>
            </div>
          )}

          {isDailyOverBudget && !isTotalOverBudget && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <i className="ri-alarm-warning-line text-orange-600"></i>
                <span className="text-sm font-medium text-orange-800">일일 예산 초과!</span>
              </div>
              <p className="text-xs text-orange-600 mt-1">
                일평균 지출이 일일 예산을 ₩{(dailySpentAverage - budget.daily).toLocaleString()} 초과했어요.
              </p>
            </div>
          )}

          {totalProgressPercentage > 80 && !isTotalOverBudget && !isDailyOverBudget && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <i className="ri-alarm-warning-line text-yellow-600"></i>
                <span className="text-sm font-medium text-yellow-800">예산 주의!</span>
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                예산의 {Math.round(totalProgressPercentage)}%를 사용했어요. 신중한 지출을 권장합니다.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
