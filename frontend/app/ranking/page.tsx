
'use client';

import { useState } from 'react';
import Link from 'next/link';
import PopularProducts from './PopularProducts';
import PopularStores from './PopularStores';
import PopularDestinations from './PopularDestinations';
import RegionalItems from './RegionalItems';
import ReviewsAndTips from './ReviewsAndTips';
import BottomNavigation from '../components/BottomNavigation';

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'stores' | 'destinations' | 'regional' | 'reviews'>('products');

  const tabs = [
    { id: 'products', label: '인기상품', icon: 'ri-shopping-bag-line' },
    { id: 'stores', label: '인기매장', icon: 'ri-store-line' },
    { id: 'destinations', label: '인기여행지', icon: 'ri-map-pin-line' },
    { id: 'regional', label: '지역별', icon: 'ri-global-line' },
    { id: 'reviews', label: '리뷰&팁', icon: 'ri-chat-3-line' }
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

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors !rounded-button flex items-center gap-2 ${
                activeTab === tab.id
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
          {activeTab === 'products' && <PopularProducts />}
          {activeTab === 'stores' && <PopularStores />}
          {activeTab === 'destinations' && <PopularDestinations />}
          {activeTab === 'regional' && <RegionalItems />}
          {activeTab === 'reviews' && <ReviewsAndTips />}
        </div>
      </div>

      <BottomNavigation activeTab="ranking" />
    </div>
  );
}
