
'use client';

import { useMemo, useState } from 'react';
import PopularProducts from './PopularProducts';
import PopularStores from './PopularStores';
import PopularDestinations from './PopularDestinations';
import RegionalItems from './RegionalItems';
import ReviewsAndTips from './ReviewsAndTips';
import BottomNavigation from '../components/BottomNavigation';
import DateRangePicker from '../components/DateRangePicker';

type TimeFilter = 'week' | 'month' | 'year' | 'custom';

export default function RankingPage() {
  // 기본 탭은 유지하되, 상단 탭 UI는 제거합니다 (요청사항).
  const [activeTab] = useState<'products' | 'stores' | 'destinations' | 'regional' | 'reviews'>('products');

  // 기간 필터 상태
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // 월/연/사용자 지정 선택 모달 상태
  const [isMonthModalOpen, setIsMonthModalOpen] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // 월 선택(복수)
  const currentYear = new Date().getFullYear();
  const [monthPickerYear, setMonthPickerYear] = useState(currentYear);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]); // "YYYY-MM"

  // 연도 선택(단일)
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const timeOptions: { key: TimeFilter; label: string }[] = [
    { key: 'week', label: '주간' },
    { key: 'month', label: '월간' },
    { key: 'year', label: '연간' },
    { key: 'custom', label: '사용자 지정' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-4">
      <div className="px-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
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

        {/* 기간 필터 */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {timeOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setTimeFilter(opt.key);
                  if (opt.key === 'month') setIsMonthModalOpen(true);
                  if (opt.key === 'year') setIsYearModalOpen(true);
                  if (opt.key === 'custom') setIsCustomModalOpen(true);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors !rounded-button ${
                  timeFilter === opt.key
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 콘텐츠 영역: 탭 버튼 영역은 제거하고 기본 탭만 표시 */}
        <div className="space-y-6">
          {activeTab === 'products' && (
            <PopularProducts
              timeFilter={timeFilter}
              customStart={customStart}
              customEnd={customEnd}
            />
          )}
          {activeTab === 'stores' && (
            <PopularStores
              timeFilter={timeFilter}
              customStart={customStart}
              customEnd={customEnd}
            />
          )}
          {activeTab === 'destinations' && (
            <PopularDestinations
              timeFilter={timeFilter}
              customStart={customStart}
              customEnd={customEnd}
            />
          )}
          {activeTab === 'regional' && (
            <RegionalItems
              timeFilter={timeFilter}
              customStart={customStart}
              customEnd={customEnd}
            />
          )}
          {activeTab === 'reviews' && <ReviewsAndTips />}
        </div>
      </div>

      <BottomNavigation activeTab="ranking" />

      {/* 월 선택 모달 */}
      {isMonthModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:w-[480px] rounded-t-2xl sm:rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">월간 선택</h3>
              <button className="text-gray-500" onClick={() => setIsMonthModalOpen(false)}>
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="flex items-center justify-between mb-3">
              <button
                className="px-2 py-1 rounded-lg border text-sm"
                onClick={() => setMonthPickerYear((y) => y - 1)}
              >
                이전년도
              </button>
              <div className="font-semibold">{monthPickerYear}년</div>
              <button
                className="px-2 py-1 rounded-lg border text-sm"
                onClick={() => setMonthPickerYear((y) => y + 1)}
              >
                다음년도
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                const key = `${monthPickerYear}-${String(m).padStart(2, '0')}`;
                const selected = selectedMonths.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() =>
                      setSelectedMonths((prev) =>
                        prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]
                      )
                    }
                    className={`py-2 rounded-lg border text-sm ${selected ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
                  >
                    {m}월
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-3 py-2 rounded-lg border" onClick={() => setIsMonthModalOpen(false)}>취소</button>
              <button
                className="px-3 py-2 rounded-lg bg-blue-600 text-white"
                onClick={() => {
                  setIsMonthModalOpen(false);
                }}
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 연간 선택 모달 */}
      {isYearModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:w-[420px] rounded-t-2xl sm:rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">연간 선택</h3>
              <button className="text-gray-500" onClick={() => setIsYearModalOpen(false)}>
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }, (_, i) => currentYear - i).map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`py-2 rounded-lg border text-sm ${selectedYear === y ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
                >
                  {y}년
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-3 py-2 rounded-lg border" onClick={() => setIsYearModalOpen(false)}>취소</button>
              <button
                className="px-3 py-2 rounded-lg bg-blue-600 text-white"
                onClick={() => {
                  setIsYearModalOpen(false);
                }}
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 사용자 지정 기간 모달 */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:w-[480px] rounded-t-2xl sm:rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">사용자 지정 기간</h3>
              <button className="text-gray-500" onClick={() => setIsCustomModalOpen(false)}>
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <DateRangePicker
              start={customStart}
              end={customEnd}
              onChange={(s, e) => {
                setCustomStart(s);
                setCustomEnd(e);
              }}
              className="mb-2"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-3 py-2 rounded-lg border" onClick={() => setIsCustomModalOpen(false)}>취소</button>
              <button
                className="px-3 py-2 rounded-lg bg-blue-600 text-white"
                onClick={() => {
                  setIsCustomModalOpen(false);
                }}
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
