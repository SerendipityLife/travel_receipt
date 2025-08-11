'use client';

import { useState } from 'react';

interface Store {
  id: number;
  name: string;
  category: string;
  visitCount: number;
  averageSpending: number;
  rating: number;
  location: string;
  popularItems: string[];
  trend: 'up' | 'down' | 'same';
  image: string;
}

export default function PopularStores() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedLocation, setSelectedLocation] = useState('전체');

  const categories = ['전체', '편의점', '백화점', '드럭스토어', '음식점', '관광지'];
  const locations = ['전체', '도쿄', '오사카', '교토', '후쿠오카'];

  const [stores] = useState<Store[]>([
    {
      id: 1,
      name: '돈키호테 시부야점',
      category: '백화점',
      visitCount: 2341,
      averageSpending: 8750,
      rating: 4.6,
      location: '도쿄',
      popularItems: ['키트카이', '화장품', '기념품'],
      trend: 'up',
      image: 'https://readdy.ai/api/search-image?query=Don%20Quijote%20store%20front%20Japan%20discount%20chain%20store%20blue%20yellow%20signage%20realistic%20detailed%20photography&width=100&height=100&seq=7&orientation=squarish'
    },
    {
      id: 2,
      name: '세븐일레븐 아사쿠사점',
      category: '편의점',
      visitCount: 1876,
      averageSpending: 1200,
      rating: 4.4,
      location: '도쿄',
      popularItems: ['컵라면', '음료수', '과자'],
      trend: 'up',
      image: 'https://readdy.ai/api/search-image?query=7-Eleven%20convenience%20store%20front%20Japan%20red%20green%20white%20logo%20signage%20realistic%20detailed%20photography&width=100&height=100&seq=8&orientation=squarish'
    },
    {
      id: 3,
      name: '마츠모토키요시 신주쿠점',
      category: '드럭스토어',
      visitCount: 1542,
      averageSpending: 5200,
      rating: 4.5,
      location: '도쿄',
      popularItems: ['화장품', '의약품', '선크림'],
      trend: 'same',
      image: 'https://readdy.ai/api/search-image?query=Matsumoto%20Kiyoshi%20drug%20store%20pharmacy%20Japan%20blue%20yellow%20signage%20cosmetics%20realistic%20detailed%20photography&width=100&height=100&seq=9&orientation=squarish'
    },
    {
      id: 4,
      name: '유니클로 긴자점',
      category: '백화점',
      visitCount: 1234,
      averageSpending: 12500,
      rating: 4.3,
      location: '도쿄',
      popularItems: ['티셔츠', '바지', '내복'],
      trend: 'down',
      image: 'https://readdy.ai/api/search-image?query=Uniqlo%20store%20front%20Japan%20clothing%20retail%20red%20white%20logo%20signage%20realistic%20detailed%20photography&width=100&height=100&seq=10&orientation=squarish'
    },
    {
      id: 5,
      name: '이치란라멘 도톤보리점',
      category: '음식점',
      visitCount: 987,
      averageSpending: 1500,
      rating: 4.7,
      location: '오사카',
      popularItems: ['라멘', '교자', '맥주'],
      trend: 'up',
      image: 'https://readdy.ai/api/search-image?query=Ichiran%20Ramen%20restaurant%20storefront%20Japan%20tonkotsu%20ramen%20chain%20red%20signage%20realistic%20detailed%20photography&width=100&height=100&seq=11&orientation=squarish'
    },
    {
      id: 6,
      name: '킨카쿠지 기념품샵',
      category: '관광지',
      visitCount: 876,
      averageSpending: 2800,
      rating: 4.2,
      location: '교토',
      popularItems: ['기념품', '엽서', '부적'],
      trend: 'same',
      image: 'https://readdy.ai/api/search-image?query=Kinkaku-ji%20temple%20gift%20shop%20souvenir%20store%20traditional%20Japanese%20architecture%20golden%20pavilion%20tourism%20realistic%20photography&width=100&height=100&seq=12&orientation=squarish'
    }
  ]);

  const filteredStores = stores.filter(store => 
    (selectedCategory === '전체' || store.category === selectedCategory) &&
    (selectedLocation === '전체' || store.location === selectedLocation)
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
      case 'up': return '방문량 증가';
      case 'down': return '방문량 감소';
      default: return '방문량 보합';
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="ri-star-fill text-yellow-400"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="ri-star-half-fill text-yellow-400"></i>);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-${i}`} className="ri-star-line text-gray-300"></i>);
    }

    return stars;
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
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {locations.map((location) => (
          <button
            key={location}
            onClick={() => setSelectedLocation(location)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors !rounded-button ${
              selectedLocation === location
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {location}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-600">
        {filteredStores.length}개의 인기매장
      </div>

      <div className="space-y-4">
        {filteredStores.map((store, index) => (
          <div key={store.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
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
                <div className="w-20 h-16 rounded-xl overflow-hidden bg-gray-100 mb-2">
                  <img 
                    src={store.image} 
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{store.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                        {store.category}
                      </span>
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                        {store.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center gap-0.5">
                        {renderStars(store.rating)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{store.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">₩{store.averageSpending.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">평균 지출</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <i className="ri-user-line text-gray-400"></i>
                    <span className="text-gray-600">방문 {store.visitCount.toLocaleString()}회</span>
                    <div className="flex items-center gap-1 ml-2">
                      <i className={getTrendIcon(store.trend)}></i>
                      <span className={`text-xs ${
                        store.trend === 'up' ? 'text-green-600' :
                        store.trend === 'down' ? 'text-red-600' :
                        'text-gray-500'
                      }`}>
                        {getTrendText(store.trend)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="text-xs text-gray-500 mb-1">인기 상품</div>
                  <div className="flex flex-wrap gap-1">
                    {store.popularItems.map((item, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                        {item}
                      </span>
                    ))}
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