'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/useAuth';
import { tripAPI, receiptAPI, userAPI, Trip, Receipt } from '../lib/firebase-api';

export default function HomeFirebase() {
  const { user, loading, logout } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [loadingReceipts, setLoadingReceipts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Firebase에서 여행 데이터 로드
  useEffect(() => {
    if (!user) return;

    const loadTrips = async () => {
      try {
        setLoadingTrips(true);
        setError(null);
        const tripsData = await tripAPI.getTrips();
        setTrips(tripsData);
      } catch (err) {
        console.error('여행 데이터 로드 실패:', err);
        setError('여행 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoadingTrips(false);
      }
    };

    const loadReceipts = async () => {
      try {
        setLoadingReceipts(true);
        const receiptsData = await receiptAPI.getReceipts();
        setReceipts(receiptsData);
      } catch (err) {
        console.error('영수증 데이터 로드 실패:', err);
      } finally {
        setLoadingReceipts(false);
      }
    };

    loadTrips();
    loadReceipts();
  }, [user]);

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  // 로그인되지 않은 경우
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">TravelReceipt</h1>
          <p className="text-gray-600 mb-6">여행 기록을 시작하려면 로그인해주세요.</p>
          <a
            href="/auth-test"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            로그인하기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold text-gray-900">TravelReceipt</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* 여행 섹션 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">내 여행</h2>
            <button
              onClick={() => {/* 새 여행 생성 */ }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              새 여행 추가
            </button>
          </div>

          {loadingTrips ? (
            <div className="text-center py-8">
              <div className="text-gray-600">여행 데이터를 불러오는 중...</div>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-gray-500">
                <p className="text-lg font-medium mb-2">여행 기록이 없습니다</p>
                <p className="mb-4">새로운 여행을 시작해보세요!</p>
                <button
                  onClick={() => {/* 새 여행 생성 */ }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  첫 여행 시작하기
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <div key={trip.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {trip.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {trip.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">위치:</span>
                      <span className="text-gray-900">{trip.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">총 지출:</span>
                      <span className="text-gray-900">
                        {trip.stats.totalAmount.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">영수증:</span>
                      <span className="text-gray-900">{trip.stats.receiptCount}개</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">예산</span>
                      <span className="text-sm font-medium">
                        {trip.budget.spent.toLocaleString()} / {trip.budget.total.toLocaleString()}원
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(trip.budget.spent / trip.budget.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 영수증 섹션 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">최근 영수증</h2>

          {loadingReceipts ? (
            <div className="text-center py-8">
              <div className="text-gray-600">영수증 데이터를 불러오는 중...</div>
            </div>
          ) : receipts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-gray-500">
                <p className="text-lg font-medium mb-2">영수증이 없습니다</p>
                <p>여행 중 영수증을 추가해보세요!</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        가게
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        날짜
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        카테고리
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        금액
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {receipts.slice(0, 10).map((receipt) => (
                      <tr key={receipt.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {receipt.store}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {receipt.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {receipt.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {receipt.amount.toLocaleString()}원
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 통계 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">총 여행</h3>
            <p className="text-3xl font-bold text-blue-600">{trips.length}개</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">총 영수증</h3>
            <p className="text-3xl font-bold text-green-600">{receipts.length}개</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">총 지출</h3>
            <p className="text-3xl font-bold text-red-600">
              {trips.reduce((sum, trip) => sum + trip.stats.totalAmount, 0).toLocaleString()}원
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
