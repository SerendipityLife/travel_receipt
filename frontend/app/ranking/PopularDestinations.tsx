'use client';

import { useState } from 'react';

interface Destination {
  id: number;
  name: string;
  country: string;
  visitorCount: number;
  averageDays: number;
  averageSpending: number;
  popularSeason: string;
  topCategories: string[];
  popularWith: string[];
  trend: 'up' | 'down' | 'same';
  image: string;
}

export default function PopularDestinations() {
  const [selectedCountry, setSelectedCountry] = useState('전체');
  const [selectedSeason, setSelectedSeason] = useState('전체');

  const countries = ['전체', '일본', '한국', '중국', '태국', '베트남'];
  const seasons = ['전체', '봄', '여름', '가을', '겨울'];

  const [destinations] = useState<Destination[]>([
    {
      id: 1,
      name: '도쿄',
      country: '일본',
      visitorCount: 4521,
      averageDays: 4.2,
      averageSpending: 89200,
      popularSeason: '봄',
      topCategories: ['음식', '쇼핑', '교통'],
      popularWith: ['20대', '30대'],
      trend: 'up',
      image: 'https://readdy.ai/api/search-image?query=Tokyo%20city%20skyline%20Japan%20modern%20buildings%20Shibuya%20crossing%20urban%20landscape%20travel%20destination%20realistic%20photography&width=100&height=100&seq=13&orientation=squarish'
    },
    {
      id: 2,
      name: '오사카',
      country: '일본',
      visitorCount: 3876,
      averageDays: 3.8,
      averageSpending: 76400,
      popularSeason: '가을',
      topCategories: ['음식', '관광', '교통'],
      popularWith: ['30대', '40대'],
      trend: 'up',
      image: 'https://readdy.ai/api/search-image?query=Osaka%20castle%20Japan%20traditional%20architecture%20cherry%20blossoms%20travel%20destination%20realistic%20photography&width=100&height=100&seq=14&orientation=squarish'
    },
    {
      id: 3,
      name: '방콕',
      country: '태국',
      visitorCount: 2934,
      averageDays: 5.1,
      averageSpending: 54300,
      popularSeason: '겨울',
      topCategories: ['음식', '마사지', '쇼핑'],
      popularWith: ['20대', '30대'],
      trend: 'same',
      image: 'https://readdy.ai/api/search-image?query=Bangkok%20Thailand%20temple%20golden%20Buddha%20Wat%20Pho%20traditional%20architecture%20travel%20destination%20realistic%20photography&width=100&height=100&seq=15&orientation=squarish'
    },
    {
      id: 4,
      name: '교토',
      country: '일본',
      visitorCount: 2187,
      averageDays: 3.2,
      averageSpending: 45600,
      popularSeason: '봄',
      topCategories: ['관광', '음식', '기념품'],
      popularWith: ['40대', '50대'],
      trend: 'down',
      image: 'https://readdy.ai/api/search-image?query=Kyoto%20Japan%20traditional%20temples%20bamboo%20forest%20geisha%20district%20Fushimi%20Inari%20travel%20destination%20realistic%20photography&width=100&height=100&seq=16&orientation=squarish'
    },
    {
      id: 5,
      name: '서울',
      country: '한국',
      visitorCount: 1876,
      averageSpending: 62100,
      averageDays: 3.7,
      popularSeason: '봄',
      topCategories: ['쇼핑', '음식', '화장품'],
      popularWith: ['20대', '30대'],
      trend: 'up',
      image: 'https://readdy.ai/api/search-image?query=Seoul%20South%20Korea%20Myeongdong%20Gangnam%20modern%20city%20skyline%20shopping%20district%20travel%20destination%20realistic%20photography&width=100&height=100&seq=17&orientation=squarish'
    },
    {
      id: 6,
      name: '호치민',
      country: '베트남',
      visitorCount: 1543,
      averageDays: 4.5,
      averageSpending: 32800,
      popularSeason: '겨울',
      topCategories: ['음식', '관광', '쇼핑'],
      popularWith: ['20대', '30대'],
      trend: 'up',
      image: 'https://readdy.ai/api/search-image?query=Ho%20Chi%20Minh%20City%20Vietnam%20street%20food%20market%20Notre%20Dame%20Cathedral%20French%20colonial%20architecture%20travel%20destination%20realistic%20photography&width=100&height=100&seq=18&orientation=squarish'
    }
  ]);

  const filteredDestinations = destinations.filter(destination => 
    (selectedCountry === '전체' || destination.country === selectedCountry) &&
    (selectedSeason === '전체' || destination.popularSeason === selectedSeason)
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
      case 'up': return '인기 상승';
      case 'down': return '인기 하락';
      default: return '인기 보합';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {countries.map((country) => (
          <button
            key={country}
            onClick={() => setSelectedCountry(country)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors !rounded-button ${
              selectedCountry === country
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {country}
          </button>
        ))}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {seasons.map((season) => (
          <button
            key={season}
            onClick={() => setSelectedSeason(season)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors !rounded-button ${
              selectedSeason === season
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {season}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-600">
        {filteredDestinations.length}개의 인기 여행지
      </div>

      <div className="space-y-4">
        {filteredDestinations.map((destination, index) => (
          <div key={destination.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
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
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{destination.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                        {destination.country}
                      </span>
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                        {destination.popularSeason}
                      </span>
                      <div className="flex items-center gap-1">
                        <i className={getTrendIcon(destination.trend)}></i>
                        <span className={`text-xs font-medium ${
                          destination.trend === 'up' ? 'text-green-600' :
                          destination.trend === 'down' ? 'text-red-600' :
                          'text-gray-500'
                        }`}>
                          {getTrendText(destination.trend)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">₩{destination.averageSpending.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">평균 지출</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <i className="ri-user-line text-gray-400"></i>
                    <span className="text-gray-600">{destination.visitorCount.toLocaleString()}명 방문</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-calendar-line text-gray-400"></i>
                    <span className="text-gray-600">평균 {destination.averageDays}일</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="mb-2">
                    <div className="text-xs text-gray-500 mb-1">인기 카테고리</div>
                    <div className="flex flex-wrap gap-1">
                      {destination.topCategories.map((category, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">주요 방문층</div>
                    <div className="flex flex-wrap gap-1">
                      {destination.popularWith.map((group, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
                          {group}
                        </span>
                      ))}
                    </div>
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