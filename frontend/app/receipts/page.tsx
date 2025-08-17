'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { tripStorage, receiptStorage, Trip, Receipt } from '../utils/mockData';

export default function TripReceiptsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  useEffect(() => {
    const t = tripStorage.getAll();
    const r = receiptStorage.getAll();
    setTrips(t);
    setReceipts(r);
    if (t.length > 0) setSelectedTripId(t[0]._id);
  }, []);

  const tripMap = useMemo(() => Object.fromEntries(trips.map(t => [t._id, t])), [trips]);

  const filteredReceipts = useMemo(() => {
    return receipts
      .filter(r => selectedTripId ? r.tripId === selectedTripId : true);
  }, [receipts, selectedTripId]);

  const sortedReceipts = useMemo(() => {
    const arr = [...filteredReceipts];
    if (sortBy === 'date') {
      return arr.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
    }
    return arr.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));
  }, [filteredReceipts, sortBy]);

  const totalAmount = filteredReceipts.reduce((sum, r) => sum + (r.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Link 
            href="/" 
            className="w-10 h-10 flex items-center justify-center !rounded-button hover:bg-gray-100 transition-colors"
          >
            <i className="ri-arrow-left-line text-xl text-gray-700"></i>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">히스토리</h1>
          <Link
            href="/receipt-scanner"
            className="w-10 h-10 flex items-center justify-center !rounded-button bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            <i className="ri-add-line text-xl text-blue-600"></i>
          </Link>
        </div>

        {/* 여행 선택 칩 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {trips.map((trip) => (
            <button
              key={trip._id}
              onClick={() => setSelectedTripId(trip._id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors !rounded-button ${
                selectedTripId === trip._id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              title={`${trip.startDate} ~ ${trip.endDate}`}
            >
              {trip.title}
            </button>
          ))}
        </div>

        {/* 요약 카드 */}
        <div className="bg-blue-50 rounded-xl p-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900 mb-1">₩{totalAmount.toLocaleString()}</div>
            <div className="text-sm text-blue-600">
              {tripMap[selectedTripId]?.title || '전체'} • {filteredReceipts.length}건
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {filteredReceipts.length}개의 영수증
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('date')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors !rounded-button ${
                sortBy === 'date'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortBy('amount')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors !rounded-button ${
                sortBy === 'amount'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              금액순
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {sortedReceipts.map((r) => (
            <Link key={r._id} href={`/receipt/${r._id}`}>
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{r.storeKr || r.store}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <i className="ri-calendar-line text-sm"></i>
                        <span>{r.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <i className="ri-time-line text-sm"></i>
                        <span>{r.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      ₩{(r.totalAmount || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{tripMap[r.tripId || '']?.title || ''}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {r.category}
                    </span>
                  </div>
                  <i className="ri-arrow-right-s-line text-xl text-gray-400"></i>
                </div>
              </div>
            </Link>
          ))}

          {trips.length > 0 && filteredReceipts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-receipt-line text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">이 여행의 영수증이 없습니다</h3>
              <p className="text-gray-500 mb-6">새 영수증을 추가해보세요</p>
              <Link
                href="/receipt-scanner"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors !rounded-button"
              >
                <i className="ri-camera-line text-xl"></i>
                영수증 스캔
              </Link>
            </div>
          )}

          {trips.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-suitcase-line text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">참여한 여행이 없습니다</h3>
              <p className="text-gray-500">홈에서 여행을 생성하거나 초대코드로 참여해보세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}