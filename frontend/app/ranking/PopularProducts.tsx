'use client';

import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  purchaseCount: number;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  popularStores: string[];
  trend: 'up' | 'down' | 'same';
  image: string;
}

export default function PopularProducts() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [timeFilter, setTimeFilter] = useState('이번달');

  const categories = ['전체', '음식', '쇼핑', '교통', '기념품', '화장품'];
  const timeFilters = ['이번주', '이번달', '최근 3개월'];

  const [products] = useState<Product[]>([
    {
      id: 1,
      name: '키트카이 마차 맛',
      category: '음식',
      purchaseCount: 1247,
      averagePrice: 280,
      priceRange: { min: 250, max: 320 },
      popularStores: ['돈키호테', '세븐일레븐', '로손'],
      trend: 'up',
      image: 'https://readdy.ai/api/search-image?query=Japanese%20Kit%20Kat%20matcha%20flavor%20green%20tea%20chocolate%20candy%20bar%20package%20product%20photography%20isolated%20on%20white%20background%20realistic%20detailed&width=80&height=80&seq=1&orientation=squarish'
    },
    {
      id: 2,
      name: '도쿄 지하철 1일권',
      category: '교통',
      purchaseCount: 892,
      averagePrice: 800,
      priceRange: { min: 800, max: 800 },
      popularStores: ['JR동일본', '메트로역'],
      trend: 'up',
      image: 'https://readdy.ai/api/search-image?query=Tokyo%20Metro%20subway%20day%20pass%20ticket%20card%20transportation%20Japan%20realistic%20detailed%20product%20photography%20isolated%20on%20white%20background&width=80&height=80&seq=2&orientation=squarish'
    },
    {
      id: 3,
      name: '시세이도 선크림',
      category: '화장품',
      purchaseCount: 634,
      averagePrice: 2800,
      priceRange: { min: 2500, max: 3200 },
      popularStores: ['마츠모토키요시', '돈키호테'],
      trend: 'same',
      image: 'https://readdy.ai/api/search-image?query=Shiseido%20sunscreen%20cream%20cosmetic%20product%20white%20tube%20Japanese%20skincare%20beauty%20product%20photography%20isolated%20on%20white%20background%20realistic&width=80&height=80&seq=3&orientation=squarish'
    },
    {
      id: 4,
      name: '라멘 컵라면',
      category: '음식',
      purchaseCount: 521,
      averagePrice: 180,
      priceRange: { min: 150, max: 220 },
      popularStores: ['세븐일레븐', '패밀리마트', '로손'],
      trend: 'down',
      image: 'https://readdy.ai/api/search-image?query=Japanese%20instant%20ramen%20cup%20noodles%20convenience%20store%20food%20product%20photography%20isolated%20on%20white%20background%20realistic%20detailed&width=80&height=80&seq=4&orientation=squarish'
    },
    {
      id: 5,
      name: '유니클로 기본 티셔츠',
      category: '쇼핑',
      purchaseCount: 487,
      averagePrice: 1200,
      priceRange: { min: 1000, max: 1500 },
      popularStores: ['유니클로'],
      trend: 'up',
      image: 'https://readdy.ai/api/search-image?query=Uniqlo%20basic%20plain%20t-shirt%20cotton%20clothing%20apparel%20white%20simple%20minimalist%20product%20photography%20isolated%20on%20white%20background&width=80&height=80&seq=5&orientation=squarish'
    },
    {
      id: 6,
      name: '도쿄 타워 기념품',
      category: '기념품',
      purchaseCount: 423,
      averagePrice: 800,
      priceRange: { min: 500, max: 1200 },
      popularStores: ['도쿄타워 매점', '기념품샵'],
      trend: 'same',
      image: 'https://readdy.ai/api/search-image?query=Tokyo%20Tower%20miniature%20souvenir%20gift%20shop%20item%20Japan%20landmark%20tourism%20product%20photography%20isolated%20on%20white%20background%20realistic&width=80&height=80&seq=6&orientation=squarish'
    }
  ]);

  const filteredProducts = products.filter(product => 
    selectedCategory === '전체' || product.category === selectedCategory
  );

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return 'ri-arrow-up-line text-green-500';
      case 'down': return 'ri-arrow-down-line text-red-500';
      default: return 'ri-subtract-line text-gray-400';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'up': return '상승';
      case 'down': return '하락';
      default: return '보합';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors !rounded-button ${
              selectedCategory === category
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {filteredProducts.length}개의 인기상품
        </div>
        <div className="flex gap-2">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors !rounded-button ${
                timeFilter === filter
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredProducts.map((product, index) => (
          <div key={product.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2 ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-600' :
                  'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 mb-2">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <i className={getTrendIcon(product.trend)}></i>
                        <span className={`text-xs font-medium ${
                          product.trend === 'up' ? 'text-green-600' :
                          product.trend === 'down' ? 'text-red-600' :
                          'text-gray-500'
                        }`}>
                          {getTrendText(product.trend)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">₩{product.averagePrice.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">평균 가격</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <i className="ri-shopping-cart-line text-gray-400"></i>
                    <span className="text-gray-600">구매 {product.purchaseCount.toLocaleString()}회</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-price-tag-3-line text-gray-400"></i>
                    <span className="text-gray-600">
                      ₩{product.priceRange.min.toLocaleString()} - ₩{product.priceRange.max.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-store-line text-gray-400"></i>
                    <span className="text-gray-600">
                      {product.popularStores.slice(0, 2).join(', ')}
                      {product.popularStores.length > 2 && ` 외 ${product.popularStores.length - 2}곳`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}