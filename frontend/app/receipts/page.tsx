'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Receipt {
  id: number;
  store: string;
  date: string;
  time: string;
  amount: number;
  category: string;
  items: number;
}

export default function AllReceipts() {
  const [receipts] = useState<Receipt[]>([
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
    },
    {
      id: 4,
      store: "로손 하라주쿠점",
      date: "2024-11-15",
      time: "16:20",
      amount: 1450,
      category: "음식",
      items: 1
    },
    {
      id: 5,
      store: "다이소 신주쿠점",
      date: "2024-11-15",
      time: "13:45",
      amount: 3200,
      category: "쇼핑",
      items: 8
    },
    {
      id: 6,
      store: "마츠모토키요시 시부야점",
      date: "2024-11-14",
      time: "19:30",
      amount: 5800,
      category: "생활용품",
      items: 4
    },
    {
      id: 7,
      store: "패밀리마트 오모테산도점",
      date: "2024-11-14",
      time: "11:15",
      amount: 890,
      category: "음식",
      items: 1
    },
    {
      id: 8,
      store: "유니클로 긴자점",
      date: "2024-11-14",
      time: "15:20",
      amount: 12500,
      category: "의류",
      items: 2
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const categories = ['전체', '음식', '쇼핑', '교통', '생활용품', '의류'];

  const filteredReceipts = receipts.filter(receipt => 
    selectedCategory === '전체' || receipt.category === selectedCategory
  );

  const sortedReceipts = [...filteredReceipts].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime();
    }
    return b.amount - a.amount;
  });

  const totalAmount = filteredReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);

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
          <h1 className="text-lg font-semibold text-gray-900">모든 영수증</h1>
          <Link
            href="/receipt-scanner"
            className="w-10 h-10 flex items-center justify-center !rounded-button bg-blue-100 hover:bg-blue-200 transition-colors"
          >
            <i className="ri-add-line text-xl text-blue-600"></i>
          </Link>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900 mb-1">₩{totalAmount.toLocaleString()}</div>
            <div className="text-sm text-blue-600">
              {selectedCategory === '전체' ? '전체' : selectedCategory} 영수증 총액 • {filteredReceipts.length}건
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6">
        <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors !rounded-button ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

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
          {sortedReceipts.map((receipt) => (
            <Link key={receipt.id} href={`/receipt/${receipt.id}`}>
              <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{receipt.store}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <i className="ri-calendar-line text-sm"></i>
                        <span>{receipt.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <i className="ri-time-line text-sm"></i>
                        <span>{receipt.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900 mb-1">
                      ₩{receipt.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {receipt.items}개 상품
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                      receipt.category === '음식' ? 'bg-orange-100 text-orange-800' :
                      receipt.category === '쇼핑' ? 'bg-purple-100 text-purple-800' :
                      receipt.category === '교통' ? 'bg-blue-100 text-blue-800' :
                      receipt.category === '생활용품' ? 'bg-green-100 text-green-800' :
                      receipt.category === '의류' ? 'bg-pink-100 text-pink-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {receipt.category}
                    </span>
                  </div>
                  <i className="ri-arrow-right-s-line text-xl text-gray-400"></i>
                </div>
              </div>
            </Link>
          ))}

          {filteredReceipts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-receipt-line text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">해당 카테고리에 영수증이 없습니다</h3>
              <p className="text-gray-500 mb-6">다른 카테고리를 선택하거나 새로운 영수증을 추가해보세요</p>
              <Link
                href="/receipt-scanner"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors !rounded-button"
              >
                <i className="ri-camera-line text-xl"></i>
                영수증 스캔
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}